import sqlite3
import os

def migrate_database():
    db_path = os.path.join(os.path.dirname(__file__), "..", "prepverse.db")
    if not os.path.exists(db_path):
        return

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("PRAGMA table_info(mock_interviews)")
    cols = [r[1] for r in cur.fetchall()]

    columns_to_add = [
        ("duration_minutes", "INTEGER DEFAULT 30"),
        ("language", "TEXT DEFAULT 'English (US)'"),
        ("topic_focus", "TEXT DEFAULT 'General Technical'"),
        ("code_editor_content", "TEXT"),
        ("scheduled_date", "TEXT"),
        ("scheduled_time", "TEXT"),
        ("detailed_report_json", "TEXT"),
    ]

    for col, col_type in columns_to_add:
        if col not in cols:
            cur.execute(f"ALTER TABLE mock_interviews ADD COLUMN {col} {col_type}")
            print(f"Added column {col} to mock_interviews")

    conn.commit()
    conn.close()
    print("Database migration completed.")

if __name__ == "__main__":
    migrate_database()
