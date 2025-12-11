import psycopg2
import pandas as pd
from typing import Dict, Any
import os

class AnalyticsService:
    def __init__(self):
        self.db_url = os.getenv('DATABASE_URL')
    
    def get_dashboard_stats(self) -> Dict[str, Any]:
        """Get comprehensive analytics for dashboard"""
        try:
            conn = psycopg2.connect(self.db_url)
            
            # Total complaints
            total = pd.read_sql("SELECT COUNT(*) as count FROM complaints", conn)['count'][0]
            
            # By status
            by_status = pd.read_sql("""
                SELECT status, COUNT(*) as count 
                FROM complaints 
                GROUP BY status
            """, conn)
            
            # By crime type
            by_crime = pd.read_sql("""
                SELECT crime_type, COUNT(*) as count 
                FROM complaints 
                GROUP BY crime_type
                ORDER BY count DESC
                LIMIT 10
            """, conn)
            
            # Average severity
            avg_severity = pd.read_sql("""
                SELECT AVG(severity_score) as avg 
                FROM complaints
            """, conn)['avg'][0]
            
            conn.close()
            
            return {
                'total_complaints': int(total),
                'by_status': by_status.to_dict('records'),
                'by_crime_type': by_crime.to_dict('records'),
                'average_severity': float(avg_severity) if avg_severity else 0
            }
        except Exception as e:
            return {'error': str(e)}

