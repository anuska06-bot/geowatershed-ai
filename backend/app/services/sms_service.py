import logging
import urllib.parse
from app.config import settings

logger = logging.getLogger("geowatershed.sms")

def send_otp_sms(mobile_number: str, otp_code: str) -> dict:
    """
    Dispatches a 6-digit OTP verification SMS.
    Currently defaults to 'simulated' gateway logging until official CDAC/NIC government gateway access is provisioned.
    When government credentials (SMS_API_KEY, SMS_SENDER_ID, SMS_ENDPOINT_URL) are set, it connects to the HTTP gateway.
    """
    sms_text = f"Your GeoWatershed AI verification code is {otp_code}. Valid for 5 minutes. Do not share. - MoRD, GoI"
    
    # Check if live government gateway credentials are configured
    if settings.SMS_GATEWAY_PROVIDER != "simulated" and settings.SMS_API_KEY and settings.SMS_ENDPOINT_URL:
        try:
            import urllib.request
            params = {
                "sender": settings.SMS_SENDER_ID,
                "mobile": mobile_number,
                "message": sms_text,
                "key": settings.SMS_API_KEY,
            }
            query_string = urllib.parse.urlencode(params)
            url = f"{settings.SMS_ENDPOINT_URL}?{query_string}"
            
            req = urllib.request.Request(url, headers={"User-Agent": "GeoWatershed-AI/2.0"})
            with urllib.request.urlopen(req, timeout=5) as response:
                result = response.read().decode("utf-8")
                logger.info(f"[SMS GATEWAY DISPATCH] Sent SMS to {mobile_number} via {settings.SMS_GATEWAY_PROVIDER}: {result}")
                return {
                    "success": True,
                    "dispatched": True,
                    "provider": settings.SMS_GATEWAY_PROVIDER,
                    "message": f"SMS OTP dispatched to {mobile_number}"
                }
        except Exception as e:
            logger.error(f"[SMS GATEWAY ERROR] Gateway {settings.SMS_GATEWAY_PROVIDER} failed: {str(e)}. Falling back to simulation.")
            return {
                "success": True,
                "dispatched": False,
                "provider": "simulated_fallback",
                "message": f"Live SMS gateway error: {str(e)}. (OTP: {otp_code})"
            }

    # Default simulated mode for evaluation and testing
    logger.info(f"[SMS GATEWAY SIMULATOR] Dispatched SMS to {mobile_number}: Verification Code [{otp_code}]. Text: '{sms_text}'")
    return {
        "success": True,
        "dispatched": True,
        "provider": "simulated",
        "message": f"SMS verification code logged for {mobile_number}"
    }
