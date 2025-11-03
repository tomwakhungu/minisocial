# MiniSocial - DevOps Practice Project

A full-stack social media application demonstrating modern DevOps practices.

## Features
- User authentication
- Post creation and sharing
- Likes and comments
- Real-time updates

## Tech Stack
- **Backend:** Node.js + Express + PostgreSQL
- **Frontend:** React
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Orchestration:** Kubernetes (kind)

## Quick Start

### Local Development
```bash
docker-compose up
```
Visit: http://localhost:3000

### Kubernetes Deployment
```bash
kind create cluster --name minisocial-cluster
kubectl apply -f k8s/
kubectl port-forward svc/frontend-service 8080:80 -n minisocial
```
Visit: http://localhost:8080

## CI/CD Pipeline
Every push to `main` branch automatically:
1. Builds Docker images
2. Pushes to Docker Hub
3. Deploys to Kubernetes cluster

## Project Structure
```
minisocial/
├── backend/          # Node.js API
├── frontend/         # React app
├── k8s/             # Kubernetes manifests
└── .github/         # CI/CD workflows
```
