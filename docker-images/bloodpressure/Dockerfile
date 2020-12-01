FROM python:3.7
EXPOSE 5000
WORKDIR /app
CMD ["/usr/local/bin/python", "app.py"]
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app.py .
ENV REDIS_HOST=localhost \
	REDIS_PORT=6379 \
	REDIS_DB=0 \