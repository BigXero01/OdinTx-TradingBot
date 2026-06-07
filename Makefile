.PHONY: dev api bot frontend install lint

dev:
	docker compose up --build

api:
	cd backend && uvicorn main:app --reload --port 8000

bot:
	cd bot && python main.py

frontend:
	cd frontend && npm run dev

install:
	cd backend && pip install -r requirements.txt
	cd bot && pip install -r requirements.txt
	cd frontend && npm install

lint:
	cd frontend && npm run lint
