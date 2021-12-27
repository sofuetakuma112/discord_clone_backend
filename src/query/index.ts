export const usersQuery = `
  {
    users {
      _id
      socket_id
      name
      email
      is_anonymous
      imageConvertedToBase64
    }
  }
`;

export const categoriesQuery = `
  {
    categories {
      _id
      name
      channels {
        _id
        name
      }
    }
  }
`;

export const allQuery = `
  {
    categories {
      _id
      name
      channels {
        _id
        name
        type
        connectingUserIds
        category_id
        chats {
          _id
          name
          message
          imageData
          imageTitle
          created
          parent_id
          user {
            _id
            name
            is_anonymous
            imageConvertedToBase64
          }
        }
        connectingUsers {
          _id
          name
          email
          is_anonymous
          imageConvertedToBase64
        }
      }
    }
  }
`;

export const dmsQuery = `
  {
    dms {
      _id
      userIds
      chats {
        _id
        name
        message
        imageData
        imageTitle
        created
        parent_id
        user {
          _id
          name
          is_anonymous
          imageConvertedToBase64
        }
      }
      users {
        _id
        name
        email
        is_anonymous
        imageConvertedToBase64
      }
    }
  }
`;
