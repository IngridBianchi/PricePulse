from sqlmodel import Session, create_engine, text
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5433/pricepulse")
engine = create_engine(DATABASE_URL)

def migrate():
    with Session(engine) as session:
        try:
            print("Adding product_name column to alerts table...")
            session.execute(text("ALTER TABLE alerts ADD COLUMN IF NOT EXISTS product_name VARCHAR"))
            session.commit()
            print("Successfully added product_name column.")
        except Exception as e:
            print(f"Error migrating database: {e}")

if __name__ == "__main__":
    migrate()
