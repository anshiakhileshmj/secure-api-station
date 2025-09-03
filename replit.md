# Overview

This is a secure API management platform designed for cryptocurrency and financial services companies to manage Anti-Money Laundering (AML) compliance. The application provides a comprehensive dashboard for API key management, transaction monitoring, risk assessment, and compliance reporting. The system integrates with multiple blockchain networks and sanctions databases to provide real-time risk scoring and decision-making for financial transactions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React 18 with TypeScript and Vite as the build tool. The application uses a component-based architecture with:

- **UI Framework**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: React Context API for authentication and local state management with React hooks
- **Routing**: React Router v6 for client-side navigation
- **Data Fetching**: TanStack React Query for server state management and caching
- **Authentication**: Supabase Auth for user authentication and session management
- **Styling**: Custom CSS variables system with dark/light theme support

## Backend Architecture
The backend consists of two main components:

### Supabase Backend
- **Database**: PostgreSQL with Row Level Security (RLS) policies
- **Authentication**: Supabase Auth handling user registration, login, and session management
- **API**: Auto-generated REST API from Supabase for CRUD operations
- **Real-time**: Supabase real-time subscriptions for live data updates

### FastAPI Relay Service
- **Framework**: FastAPI with Python for the relay API service
- **Transaction Processing**: Web3 integration for blockchain transaction handling
- **Risk Assessment**: Custom risk scoring engine with configurable feature detection
- **Sanctions Checking**: Local JSON-based sanctions list with multi-source validation
- **Rate Limiting**: Built-in rate limiting and API key authentication

## Database Schema
The system uses several key tables:

- **api_keys**: Stores API key information, usage limits, and authentication details
- **api_usage**: Tracks API usage statistics and analytics
- **sanctioned_wallets**: Maintains a list of sanctioned cryptocurrency addresses
- **risk_scores**: Stores calculated risk scores for wallet addresses
- **developer_profiles**: User profile information and API usage plans
- **api_endpoints**: Documentation and configuration for available API endpoints

## Security Architecture
- **API Key Authentication**: Bearer token authentication with hashed key storage
- **Row Level Security**: Database-level access control ensuring users only see their own data
- **Rate Limiting**: Configurable rate limits per API key to prevent abuse
- **Audit Logging**: Comprehensive logging of all API requests and sanctions actions
- **Confirmation System**: Multi-step confirmation process for sensitive operations

## Risk Assessment Engine
The platform includes a sophisticated risk scoring system that:

- Analyzes transaction patterns and wallet behavior
- Integrates with multiple data sources (Etherscan, Bitquery, etc.)
- Provides real-time risk scoring with configurable thresholds
- Supports custom risk factors and feature detection
- Maintains historical risk profiles and trend analysis

# External Dependencies

## Core Infrastructure
- **Supabase**: Backend-as-a-Service providing PostgreSQL database, authentication, real-time subscriptions, and auto-generated APIs
- **Vercel**: Frontend hosting and deployment platform with automatic builds from Git
- **Render**: Backend hosting for the FastAPI relay service

## Blockchain Integration
- **Web3.py**: Python library for Ethereum blockchain interaction and transaction processing
- **Etherscan API**: Ethereum blockchain data and transaction history analysis
- **Bitquery GraphQL**: Multi-blockchain data aggregation and analysis
- **Alchemy API**: Ethereum node provider for reliable blockchain access

## UI and Styling
- **Radix UI**: Headless UI components for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography
- **Recharts**: Chart library for analytics and data visualization

## Development Tools
- **TypeScript**: Static type checking for improved code quality
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting and formatting
- **React Query**: Server state management and caching

## Authentication and Data
- **Supabase Client**: JavaScript client for Supabase services
- **React Router**: Client-side routing and navigation
- **Sonner**: Toast notification system for user feedback

## External APIs and Services
- **OFAC Sanctions Lists**: Official sanctions data for compliance checking
- **Multiple Blockchain APIs**: For cross-chain transaction monitoring and risk assessment
- **Email Services**: Through Supabase for user notifications and alerts