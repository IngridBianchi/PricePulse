from sqlmodel import Session, create_engine, text
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5433/pricepulse")
engine = create_engine(DATABASE_URL)

def migrate():
    with Session(engine) as session:
        try:
            print("Adding name column to sources table...")
            session.execute(text("ALTER TABLE sources ADD COLUMN IF NOT EXISTS name VARCHAR"))
            session.commit()
            print("Successfully added name column.")
        except Exception as e:
            print(f"Error migrating database: {e}")

if __name__ == "__main__":
    migrate()
