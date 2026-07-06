FROM python:3.11-slim-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Force IPv4 for all DNS resolution (Supabase returns AAAA records unreachable on Railway)
RUN echo 'label ::ffff:0:0/96 4' > /etc/gai.conf && \
    echo 'precedence ::ffff:0:0/96 100' >> /etc/gai.conf && \
    echo 'precedence ::1/128 0' >> /etc/gai.conf

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Playwright
RUN playwright install-deps chromium && playwright install chromium

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
