import sys
import os

# Add parent dir to path if needed to find database module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from database import engine

def migrate():
    columns = [
        ("tag", "VARCHAR(255)", "'Special Offer'"),
        ("processor", "VARCHAR(255)", "NULL"),
        ("ram", "VARCHAR(255)", "NULL"),
        ("storage", "VARCHAR(255)", "NULL"),
        ("display", "VARCHAR(255)", "NULL"),
        ("graphics", "VARCHAR(255)", "NULL")
    ]
    
    print("Connecting to database...")
    with engine.connect() as conn:
        for col_name, col_type, default in columns:
            try:
                # Check if column exists
                res = conn.execute(text(f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='hero_sections' AND column_name='{col_name}';
                """)).fetchone()
                
                if not res:
                    print(f"Adding column '{col_name}' to hero_sections...")
                    # For PostgreSQL we should also commit or run connection with autocommit
                    conn.execute(text(f"ALTER TABLE hero_sections ADD COLUMN {col_name} {col_type} DEFAULT {default};"))
                    conn.commit()
                    print(f"Column '{col_name}' added successfully.")
                else:
                    print(f"Column '{col_name}' already exists.")
            except Exception as e:
                print(f"Error adding column '{col_name}': {e}")
        
    print("Database migration completed.")

if __name__ == "__main__":
    migrate()
