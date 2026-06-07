FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Persistent volume mount point for subscriber DB
RUN mkdir -p /app/data
ENV SUBSCRIBERS_DB=/app/data/subscribers.db

CMD ["python", "main.py"]
