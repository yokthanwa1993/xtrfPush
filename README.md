# xtrfPush - ntfy CapRover Integration

A comprehensive notification service for CapRover using [ntfy](https://ntfy.sh) - a simple HTTP-based pub-sub notification service. This service provides both REST API and GraphQL API for sending push notifications to your devices for CapRover deployments, server status, and errors.

## 🚀 Features

- **Dual API Support**: Both REST API and GraphQL API
- **CapRover Integration**: Dedicated endpoints for deployment notifications
- **Multiple Priority Levels**: Support for min, low, default, high, and urgent priorities
- **Rich Notifications**: Support for tags, icons, click actions, and custom titles
- **Health Monitoring**: Built-in health checks and status monitoring
- **Easy Deployment**: One-click deployment to CapRover
- **Comprehensive Testing**: Complete test suite for verification
- **Real-time Statistics**: Track notification success rates and response times

## 📋 Prerequisites

- CapRover instance
- ntfy account (or use public server at https://ntfy.sh)
- Node.js 16+ (for local development)

## 🛠️ Installation

### Option 1: One-Click Deploy to CapRover

1. **Create ntfy topic**:
   - Visit [https://ntfy.sh](https://ntfy.sh)
   - Create a new topic (e.g., `caprover-notifications`)
   - Note down the topic name

2. **Deploy to CapRover**:
   - In CapRover dashboard, go to "One-Click Apps"
   - Add this repository or use the `caprover.json` configuration
   - Fill in the required variables:
     - **NTFY_SERVER**: `https://ntfy.sh` (or your private server)
     - **NTFY_TOPIC**: Your topic name (e.g., `caprover-notifications`)
     - **NTFY_TOKEN**: (Optional) Bearer token for private topics

### Option 2: Manual Deployment

1. **Clone this repository**:
   ```bash
   git clone https://github.com/yourusername/xtrfPush.git
   cd xtrfPush
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env`:
   ```env
   NTFY_SERVER=https://ntfy.sh
   NTFY_TOPIC=caprover-notifications
   NTFY_TOKEN=
   PORT=3000
   ```

3. **Deploy to CapRover**:
   ```bash
   caprover deploy
   ```

## 📱 Setting Up ntfy

### Mobile App Setup

1. **Install ntfy app**:
   - [Android](https://play.google.com/store/apps/details?id=io.heckel.ntfy)
   - [iOS](https://apps.apple.com/us/app/ntfy/id1625396347)

2. **Subscribe to your topic**:
   - Open the app
   - Add subscription: `caprover-notifications`
   - Configure notification settings

### Web Interface

Visit `https://ntfy.sh/caprover-notifications` to see notifications in your browser.

## 🔗 API Endpoints

### REST API

#### Health Check
```http
GET /health
```

#### Send Simple Notification
```http
POST /notify
Content-Type: application/json

{
  "message": "Your notification message",
  "title": "Optional title",
  "priority": "default",
  "tags": "bell,caprover",
  "icon": "🚀",
  "click": "https://your-app.com"
}
```

#### Send Urgent Notification
```http
POST /notify/urgent
Content-Type: application/json

{
  "message": "Urgent message here"
}
```

#### Send Priority Notification
```http
POST /notify/priority/{priority}
Content-Type: application/json

{
  "message": "Your message"
}
```

Priority levels: `min`, `low`, `default`, `high`, `urgent`

#### CapRover Deployment Notification
```http
POST /caprover/deploy
Content-Type: application/json

{
  "appName": "my-app",
  "status": "success",
  "branch": "main",
  "commit": "abc123def456"
}
```

#### CapRover Error Notification
```http
POST /caprover/error
Content-Type: application/json

{
  "error": "Error message",
  "appName": "my-app",
  "details": "Additional details"
}
```

#### Test Endpoint
```http
GET /test
```

### GraphQL API

#### GraphQL Playground
Visit `/graphql` for the interactive GraphQL Playground.

#### Health Check Query
```graphql
query {
  health {
    status
    timestamp
    service
    ntfy_server
    topic
    uptime
    version
  }
}
```

#### Server Statistics Query
```graphql
query {
  stats {
    totalNotifications
    successfulNotifications
    failedNotifications
    averageResponseTime
    lastNotificationTime
  }
}
```

#### Test Notification Query
```graphql
query {
  testNotification {
    success
    message
    data {
      id
      time
      topic
      title
      message
      priority
      tags
    }
    error
  }
}
```

#### Send Simple Notification Mutation
```graphql
mutation {
  sendSimpleNotification(input: {
    message: "Hello from GraphQL!"
    title: "GraphQL Test"
    priority: DEFAULT
    tags: ["bell", "graphql"]
    icon: "🚀"
    click: "https://your-app.com"
  }) {
    success
    message
    data {
      id
      time
      topic
      title
      message
      priority
      tags
    }
    error
  }
}
```

#### Send Deployment Notification Mutation
```graphql
mutation {
  sendDeploymentNotification(input: {
    appName: "my-webapp"
    status: "success"
    branch: "main"
    commit: "abc123def456"
    environment: "production"
    duration: 45
  }) {
    success
    message
    data {
      id
      time
      topic
      title
      message
      priority
      tags
    }
    error
  }
}
```

#### Send Error Notification Mutation
```graphql
mutation {
  sendErrorNotification(input: {
    error: "Database connection failed"
    appName: "my-webapp"
    details: "Connection timeout after 30 seconds"
    stackTrace: "Error: connect ECONNREFUSED..."
  }) {
    success
    message
    data {
      id
      time
      topic
      title
      message
      priority
      tags
    }
    error
  }
}
```

## 🧪 Testing

### Local Testing

1. **Start the REST server**:
   ```bash
   npm install
   npm start
   ```

2. **Start the GraphQL server**:
   ```bash
   npm run start:graphql
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

4. **Run GraphQL tests**:
   ```bash
   npm run test:graphql
   ```

### Remote Testing

After deployment, test your service:

```bash
# Set your deployed URL
export BASE_URL=https://your-app.your-domain.com

# Run REST API tests
npm test

# Run GraphQL tests
npm run test:graphql
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NTFY_SERVER` | ntfy server URL | `https://ntfy.sh` |
| `NTFY_TOPIC` | Topic name for notifications | `caprover-notifications` |
| `NTFY_TOKEN` | Bearer token for private topics | (empty) |
| `PORT` | Server port | `3000` |

### Notification Options

- **Priority**: `min`, `low`, `default`, `high`, `urgent`
- **Tags**: Comma-separated emoji tags
- **Icon**: Emoji or URL for notification icon
- **Click**: URL to open when notification is clicked
- **Title**: Custom notification title

## 📝 Usage Examples

### REST API Examples

#### Basic Notification
```javascript
const response = await fetch('https://your-app.your-domain.com/notify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello from CapRover!',
    title: 'Test Notification',
    tags: 'bell,rocket'
  })
});
```

#### Deployment Success
```javascript
const response = await fetch('https://your-app.your-domain.com/caprover/deploy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    appName: 'my-webapp',
    status: 'success',
    branch: 'main',
    commit: 'abc123def456'
  })
});
```

### GraphQL API Examples

#### Using Apollo Client
```javascript
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://your-app.your-domain.com/graphql',
  cache: new InMemoryCache(),
});

// Send notification
const SEND_NOTIFICATION = gql`
  mutation SendNotification($input: SimpleNotificationInput!) {
    sendSimpleNotification(input: $input) {
      success
      message
      error
    }
  }
`;

const result = await client.mutate({
  mutation: SEND_NOTIFICATION,
  variables: {
    input: {
      message: "Hello from GraphQL!",
      title: "Test",
      priority: "DEFAULT",
      tags: ["bell", "test"]
    }
  }
});
```

#### Using fetch with GraphQL
```javascript
const response = await fetch('https://your-app.your-domain.com/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `
      mutation {
        sendSimpleNotification(input: {
          message: "Hello from GraphQL!"
          title: "Test"
          priority: DEFAULT
          tags: ["bell", "test"]
        }) {
          success
          message
          error
        }
      }
    `
  })
});
```

## 🔄 Integration with CapRover

### Webhook Integration

You can integrate this service with CapRover webhooks:

1. **In CapRover dashboard**, go to your app settings
2. **Add webhook** pointing to your ntfy service
3. **Configure webhook events** for deployments, errors, etc.

### Example Webhook Configuration

```json
{
  "url": "https://your-ntfy-app.your-domain.com/caprover/deploy",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "appName": "{{appName}}",
    "status": "{{status}}",
    "branch": "{{branch}}",
    "commit": "{{commit}}"
  }
}
```

## 🚨 Security Considerations

- **Public Topics**: Topics without tokens are public and readable by anyone
- **Private Topics**: Use tokens for sensitive notifications
- **HTTPS**: Always use HTTPS in production
- **Rate Limiting**: Consider implementing rate limiting for public endpoints

## 📚 Resources

- [ntfy Documentation](https://docs.ntfy.sh/)
- [ntfy GitHub](https://github.com/binwiederhier/ntfy)
- [CapRover Documentation](https://caprover.com/docs/)
- [GraphQL Documentation](https://graphql.org/)
- [Push by Techulus](https://push.lslly.com) - Alternative notification service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **ntfy Issues**: [GitHub Issues](https://github.com/binwiederhier/ntfy/issues)
- **CapRover Support**: [CapRover Community](https://caprover.com/community.html)

## 🎯 Quick Start

1. **Create ntfy topic**: Visit [https://ntfy.sh](https://ntfy.sh)
2. **Deploy to CapRover**: Use one-click deploy or manual deployment
3. **Install ntfy app**: Download from App Store or Google Play
4. **Subscribe to topic**: Add your topic in the app
5. **Test notifications**: Use the `/test` endpoint or GraphQL Playground
6. **Integrate with CapRover**: Set up webhooks for automatic notifications

Happy notifying! 🎉 