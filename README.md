# Nova News 📰

Nova News is a sophisticated, AI-powered news aggregator built with React, Tailwind CSS, and the Gemini API. It features a curated bento-style layout and provides real-time "Smart Insights" through AI-driven summarization.

## ✨ Features

- **AI-Powered Analysis**: Get instant summaries and context for any article using Google's Gemini 3.1 Flash model.
- **Elegant Bento Layout**: A modern, responsive design that prioritizes readability and visual hierarchy.
- **Advanced Dark Mode**: A meticulously crafted dark theme that reduces eye strain while maintaining high contrast.
- **Dynamic Categorization**: Filter news by Technology, Business, Science, Sports, Entertainment, and World events.
- **Real-time Search**: Quickly find the stories that matter to you.
- **Smooth Animations**: Powered by `motion` for fluid transitions and state changes.

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini API (@google/genai)
- **Icons**: Lucide React
- **Animations**: Motion (formerly Framer Motion)

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS version)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd nova-news
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🎨 Design Philosophy

Nova News follows a "Swiss Modern" design aesthetic, utilizing:
- **Typography**: Inter (Sans) for UI and Playfair Display (Serif) for headlines to create an editorial feel.
- **Spacing**: Generous whitespace and a strict grid system to ensure clarity.
- **Color**: A minimal palette that adapts perfectly between light and dark modes.

## 📄 License

This project is licensed under the Apache-2.0 License.
