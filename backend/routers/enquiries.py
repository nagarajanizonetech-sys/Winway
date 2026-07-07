import os
import urllib.request
import urllib.parse
import json
from datetime import datetime
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
import crud, schemas
from database import get_db

router = APIRouter(prefix="/enquiries", tags=["enquiries"])

# Load Web3Forms Access Key from Environment
WEB3FORMS_ACCESS_KEY = os.getenv("WEB3FORMS_ACCESS_KEY", "04aeb635-48f6-462d-bd53-60b634d005f7")

def send_web3forms_email(enquiry: schemas.EnquiryCreate):
    url = "https://api.web3forms.com/submit"
    
    # Format current UTC time for timestamp
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    
    # Build payload so Web3Forms auto-renders a beautifully formatted grid layout
    payload = {
        "access_key": WEB3FORMS_ACCESS_KEY,
        "from_name": "Winway Computers Enquiry System",
        "subject": f"🔥 New Laptop Enquiry: {enquiry.product_name} - {enquiry.name}",
        "replyto": enquiry.email,
        "Customer Name": enquiry.name,
        "Customer Email": enquiry.email,
        "Customer Phone": enquiry.phone,
        "Product Interested In": enquiry.product_name,
        "Message / Requirements": enquiry.message,
        "Enquiry Timestamp": timestamp
    }
    
    try:
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": "FastAPI/Winway-Backend"
            },
            method="POST"
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            if res_json.get("success"):
                print(f"--- EMAIL SENT SUCCESSFULLY VIA WEB3FORMS ---")
                print(f"To: Company Gmail (Web3Forms Inbox)")
                print(f"Customer: {enquiry.name} ({enquiry.email})")
                print(f"Product: {enquiry.product_name}")
                print(f"---------------------------------------------")
            else:
                print(f"--- WEB3FORMS API ERROR ---")
                print(f"Response: {res_json}")
                print(f"---------------------------")
    except Exception as e:
        print(f"--- WEB3FORMS SYSTEM ERROR ---")
        print(f"Exception: {str(e)}")
        print(f"------------------------------")

@router.post("/", response_model=schemas.Enquiry)
def create_enquiry(enquiry: schemas.EnquiryCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_enquiry = crud.create_enquiry(db, enquiry)
    # Forward enquiry details to Web3Forms Gmail delivery in background
    background_tasks.add_task(send_web3forms_email, enquiry)
    return db_enquiry
