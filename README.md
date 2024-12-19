# Interactive AI Adventure

An interactive web application that uses OpenAI's Assistant API to generate a choose-your-own-adventure story in real-time.  

## Overview

The application generates pages that each contain a text description of the setting and situation, culminating in a decision point.  The page also contains a set of options that the user can choose from, and the choice they make is used to generate the next page.

## Prerequisites

- PHP 8.2 or higher
- Composer
- OpenAI API Key
- OpenAI Assistant ID (use the OpenAI platform/playground to create an Assistant and copy the ID)

## Project Structure

- `backend/`: Contains the PHP backend code
  - `routes/`: API endpoint handlers
  - `helpers/`: Helper functions and utilities
  - `.env`: Environment variables configuration
- `frontend/`: Contains the HTML, CSS, and JavaScript for the user interface (ReactJS frontend using Chakra UI).

## Installation

Clone the repository:

```bash
git clone https://github.com/hardlynoticeable/decide-quest
```

## Configuration

### Environment Variables
The application requires two main configuration items in your `backend/.env` file:

1. **OPENAI_API_KEY**: Your OpenAI API key for authentication
2. **OPENAI_ASSISTANT_ID**: The ID of your pre-configured OpenAI Assistant

### OpenAI Assistant Setup
To use this application, you need to:
1. Create an OpenAI account
2. Set up an Assistant in the OpenAI platform
3. Configure the Assistant with appropriate instructions
4. Copy the Assistant ID to your .env file

## Features

- Interactive storytelling powered by OpenAI's Assistant API
- Dynamic story progression based on user choices
- Persistent conversation threading
- Robust error handling
- Real-time response processing

## Technical Details

### API Integration
- Uses OpenAI's official PHP client
