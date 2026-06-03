# PromptLang

PromptLang is a full-stack AI coding assistant that allows users to create accounts, log in, submit programming prompts, and receive AI-generated code along with detailed explanations.

## Features

- User registration and authentication
- Secure password storage
- AI-generated code responses
- AI-generated code explanations
- Persistent PostgreSQL database storage
- React frontend
- Spring Boot backend
- REST API architecture
- Chat history persistence

## Tech Stack

### Frontend
- React
- JavaScript
- Vite
- Fetch API

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Spring Security

### Database
- PostgreSQL

### AI Integration
- OpenAI API

## Architecture

```text
React Frontend
      ↓
REST API
      ↓
Spring Boot Backend
      ↓
PostgreSQL Database

      ↓
OpenAI API