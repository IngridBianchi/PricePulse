FROM python:3.11-slim-bookworm

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright chromium and its system dependencies
RUN playwright install chromium --with-deps

# Copy the rest of the application
COPY . .

# Command will be overridden in docker-compose for api/worker
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
