from email.policy import default
from django.db import models, connection
from Users.models import MyUser
from django.utils import timezone

# sentiment analysis
from google.cloud import language_v2


# Create your models here.


class Journal(models.Model):
    """A Journals table pointing to the owner used to link entries together with the user"""

    journal_id = models.AutoField(primary_key=True)
    user_id = models.OneToOneField(MyUser, on_delete=models.CASCADE)
    creation_date = models.DateField(auto_now_add=True)

    def get_all_entries(self):
        # django's reverse look up class variable that can get all everything that has a foreign key to it
        return self.entry_set.all()

    def get_most_active_month(self):
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
SELECT
  EXTRACT(MONTH FROM "Entries_entry".creation_date) AS month,
  COUNT(*) AS entry_count
FROM
  "Entries_entry"
JOIN
  "Entries_journal" ON "Entries_journal".journal_id = "Entries_entry".journal_id_id
WHERE
  "Entries_journal".journal_id = {self.journal_id}
GROUP BY
  month
ORDER BY
  entry_count DESC
LIMIT 1;
                """
            )
            row = cursor.fetchone()
            return row[0] if row else None

    def get_average_entries_per_week(self):
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
SELECT
  AVG(entry_count)
FROM (
  SELECT
    EXTRACT(YEAR FROM "Entries_entry".creation_date) AS year,
    EXTRACT(WEEK FROM "Entries_entry".creation_date) AS week,
    COUNT(*) AS entry_count
  FROM
    "Entries_entry"
  JOIN
    "Entries_journal" ON "Entries_journal".journal_id = "Entries_entry".journal_id_id
  WHERE
    "Entries_journal".journal_id = {self.journal_id}
  GROUP BY
    year, week
)
LIMIT 1; 
                """
            )
            row = cursor.fetchone()
            return row[0] if row else None

    def get_total_word_count(self):
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
SELECT
  SUM(
    LENGTH("Entries_entry".content) - LENGTH(REPLACE("Entries_entry".content, ' ', '')) + 1
  ) AS total_word_count
FROM
  "Entries_entry"
JOIN
  "Entries_journal" ON "Entries_journal".journal_id = "Entries_entry".journal_id_id
WHERE
  "Entries_journal".journal_id = {self.journal_id};
                """
            )
            row = cursor.fetchone()
            return row[0] if row else None

    def __str__(self):
        return f"{self.user_id}'s Journal"


class Entry(models.Model):
    """An Entry table used to store the data of t journal entry and also tell us which journal it belongs to"""

    entry_id = models.AutoField(primary_key=True)
    journal_id = models.ForeignKey("Journal", on_delete=models.CASCADE)
    creation_date = models.DateField(default=timezone.now, editable=True)
    title = models.CharField(max_length=50, default="Untitled")
    content = models.TextField()
    sentiment = models.FloatField(default=None, blank=True, null=True)

    def __str__(self) -> str:
        return f"Entry {self.entry_id} from {self.journal_id}"

    # analyse data and return sentiment score range from -1 to 1 by calling google cloud api
    def analyse_sentiment(self) -> float:
        client = language_v2.LanguageServiceClient()
        document = language_v2.Document(
            content=self.content, type_=language_v2.Document.Type.PLAIN_TEXT
        )
        response = client.analyze_sentiment(request={"document": document})
        return response.document_sentiment.score
