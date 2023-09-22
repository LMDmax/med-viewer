import { gql } from "@apollo/client";

export const FETCH_CONVERSATION = gql`
  query Query($query: ReaderInput) {
    readChat(query: $query) {
      success
      data {
        _id
        from
        to
        toName
        relationString
        payload {
          body
          types
        }
        annotation {
          left
          top
          width
          height
          zoomLevel
        }
        isDeleted
        createdAt
        updatedAt
        isEncrypted
        encryptionAlgo
        integrity
        app
        fromImage
        fromName
        mentionedUsers {
          toId
          toName
        }
      }
      message
      meta {
        pageNumber
        hasNextPage
        totalPages
        total
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation Mutation($body: MessageInput) {
    saveChat(body: $body) {
      success
      message
      data {
        from
        to
        toName
        relationString
        payload {
          body
          types
        }
        annotation {
          left
          top
          width
          height
          zoomLevel
          hash
        }
        slideId
        caseId
        isDeleted
        createdAt
        updatedAt
        isEncrypted
        encryptionAlgo
        integrity
        app
        mentionedUsers {
          toId
          toName
          message
        }
      }
    }
  }
`;

export const CHAT_SUBSCRIPTION = gql`
  subscription Subscription($toId: String, $fromId: String) {
    newChat(toId: $toId, fromId: $fromId) {
      success
      message
      data {
        from
        fromName
        fromImage
        to
        toName
        relationString
        payload {
          body
          types
        }
        isDeleted
        createdAt
        updatedAt
        isEncrypted
        encryptionAlgo
        integrity
        app
        mentionedUsers {
          toId
          toName
        }
      }
    }
  }
`;

export const GET_QUERIES = gql`
  query Query($query: ReaderNotificationInput) {
    readNotification(query: $query) {
      data {
        app
        chatId
        createdAt
        isRead
        isResolved
        message
        toId
        toName
        updatedAt
      }
      message
      success
    }
  }
`;

export const QUERY_SUBSCRIPTION = gql`
  subscription Subscription($toId: String) {
    notifyChat(toId: $toId) {
      chatId
      message
      toId
      toName
      isRead
      isResolved
      app
      createdAt
      updatedAt
    }
  }
`;
