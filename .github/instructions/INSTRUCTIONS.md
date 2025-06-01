# 3D T-Shirt Designer - Project Instructions

## Overview
This project is a modern web application that allows users to design and customize t-shirts in a 3D environment. Users can change colors, upload custom designs, and generate AI-powered designs using DALL-E integration. The application features real-time 3D visualization built with Three.js and React Three Fiber.

## Project Structure

### Frontend (Client)
- **Framework**: React 18 with Vite
- **3D Rendering**: Three.js with React Three Fiber and Drei
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **State Management**: Valtio
- **Color Picker**: React Color

### Backend (Server)
- **Runtime**: Node.js with Express
- **AI Integration**: OpenAI DALL-E API
- **File Upload**: Cloudinary (configured but not fully implemented)
- **Database**: MongoDB with Mongoose (configured but not fully implemented)

## Prerequisites

Before running this project, ensure you have:

1. **Node.js** (v14 or later)
2. **npm** or **yarn** package manager
3. **OpenAI API Key** for AI-powered design generation

## Environment Setup

### 1. Clone and Install Dependencies

```powershell
# Navigate to the project directory
cd e:\3d-Tshirt-Designer

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Environment Variables

Create a `.env` file in the `server` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MONGODB_URL=your_mongodb_connection_string
```

**Note**: Currently, only the OpenAI API key is required for full functionality.

## Running the Application

### Development Mode

You need to run both the client and server simultaneously:

#### Terminal 1 - Start the Backend Server
```powershell
cd server
npm start
```
The server will start on `http://localhost:8080`

#### Terminal 2 - Start the Frontend Client
```powershell
cd client
npm run dev
```
The client will start on `http://localhost:5173`

### Production Build

To build the client for production:

```powershell
cd client
npm run build
```

To preview the production build:
```powershell
npm run preview
```

## Features and Functionality

### 1. Home Page
- Welcome screen with animated introduction
- "Customize It" button to enter the 3D customization interface
- Built with Framer Motion animations

### 2. 3D T-Shirt Customization
- **Real-time 3D Model**: Interactive t-shirt model that users can rotate and view
- **Color Picker**: Change the base color of the t-shirt
- **File Upload**: Upload custom images/logos to apply to the t-shirt
- **AI Design Generation**: Generate custom designs using DALL-E AI
- **Design Positioning**: Apply designs as logos or full shirt patterns

### 3. Editor Tabs
- **Color Picker**: HSV color wheel for t-shirt base color
- **File Picker**: Upload custom images (PNG, JPG, etc.)
- **AI Picker**: Generate designs using text prompts

### 4. Filter Options
- **Logo Shirt**: Apply design as a small logo
- **Stylish Shirt**: Apply design as a full shirt texture

### 5. Export Functionality
- Download the customized t-shirt as an image

## Key Components

### Frontend Components

#### Pages
- `Home.jsx`: Landing page with introduction
- `Customizer.jsx`: Main customization interface

#### Canvas Components
- `index.jsx`: Main 3D canvas setup
- `Shirt.jsx`: 3D t-shirt model component
- `Backdrop.jsx`: 3D environment backdrop
- `CameraRig.jsx`: Camera controls and positioning

#### UI Components
- `ColorPicker.jsx`: Color selection interface
- `FilePicker.jsx`: File upload interface
- `AIPicker.jsx`: AI prompt input interface
- `CustomButton.jsx`: Reusable button component
- `Tab.jsx`: Navigation tab component

#### Configuration
- `config.js`: API endpoints and configuration
- `constants.js`: UI constants and tab definitions
- `helpers.js`: Utility functions
- `motion.js`: Framer Motion animation definitions

#### State Management
- `store/index.js`: Valtio state management for app state

### Backend Components

#### Main Server
- `index.js`: Express server setup with CORS and routing

#### Routes
- `dalle.routes.js`: OpenAI DALL-E API integration for AI image generation

## API Endpoints

### DALL-E Routes (`/api/v1/dalle`)
- `GET /`: Health check endpoint
- `POST /`: Generate AI images from text prompts

## Customization and Extension

### Adding New Features

1. **New Design Tools**: Add new tabs in `constants.js` and create corresponding components
2. **Additional 3D Models**: Add new GLB files to `public/` and update the Shirt component
3. **Enhanced AI Integration**: Extend the DALL-E routes for more AI capabilities
4. **User Accounts**: Implement the MongoDB models for user authentication and design saving

### Styling Customization

The project uses Tailwind CSS for styling. Key configuration files:
- `tailwind.config.js`: Tailwind configuration
- `postcss.config.js`: PostCSS configuration
- `index.css`: Global styles and Tailwind imports

### 3D Model Customization

The t-shirt 3D model is loaded from `public/shirt_baked.glb`. To use a different model:
1. Replace the GLB file in the public directory
2. Update the model path in the Shirt component
3. Adjust material properties and UV mapping as needed

## Troubleshooting

### Common Issues

1. **3D Model Not Loading**
   - Ensure `shirt_baked.glb` is in the `public/` directory
   - Check browser console for Three.js errors

2. **AI Generation Not Working**
   - Verify OpenAI API key is correctly set in `.env`
   - Check network connectivity and API limits

3. **Styles Not Loading**
   - Ensure Tailwind CSS is properly configured
   - Run `npm install` to install all dependencies

4. **Server Connection Issues**
   - Verify both client and server are running
   - Check that ports 3000 (client) and 8080 (server) are available

### Performance Optimization

- The 3D model should be optimized for web use (low poly count)
- Images should be compressed before upload
- Consider implementing texture atlasing for better performance

## Development Tips

1. **State Management**: The app uses Valtio for reactive state management. State changes automatically trigger re-renders.

2. **3D Development**: Use React Three Fiber's debugging tools and browser dev tools for 3D debugging.

3. **Animation**: Framer Motion animations are defined in `motion.js` and can be reused across components.

4. **API Integration**: The server uses environment variables for API keys. Never commit sensitive keys to version control.

## Future Enhancements

1. **User Authentication**: Implement user accounts with MongoDB
2. **Design Gallery**: Save and share custom designs
3. **Multiple Products**: Extend to other clothing items
4. **Advanced Materials**: Add fabric textures and material properties
5. **Social Features**: Sharing and collaborative design features
6. **E-commerce Integration**: Direct ordering and printing capabilities

## Security Considerations

1. Keep API keys secure and use environment variables
2. Implement proper file upload validation
3. Add rate limiting for AI generation requests
4. Use HTTPS in production
5. Validate and sanitize user inputs

## Deployment

For production deployment:

1. Build the client application
2. Serve static files from a CDN
3. Deploy the server to a cloud platform (Heroku, Vercel, etc.)
4. Set up proper environment variables in production
5. Configure domain and SSL certificates

## Support and Maintenance

- Regularly update dependencies for security patches
- Monitor API usage and costs (OpenAI API)
- Keep 3D models optimized for performance
- Test across different browsers and devices

---

Created by: Hasan
Project Type: 3D Web Application
Technology Stack: React + Three.js + Node.js + Express + OpenAI
