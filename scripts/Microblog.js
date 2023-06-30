export default class Microblog {
  #users;

  constructor() {
    if (Microblog.instance) {
      return Microblog.instance;
    }

    this.#users = {};
    Microblog.instance = this;
  }

  addUser(name) {
    try {
      if (name && !this.#users[name]) {
        this.#users[name] = { messages: [], follows: [] };
      }
    } catch (error) {
      console.error("Error while adding a user:", error);
    }
  }

  addMessage(name, text) {
    try {
      if (name && text && this.#users[name]) {
        const currentDate = new Date().toISOString();
        this.#users[name].messages.push({ text, date: currentDate });
      }
    } catch (error) {
      console.error("Error while adding a message:", error);
    }
  }

  getAllUsers() {
    try {
      return this.#users;
    } catch (error) {
      console.error("Error while retrieving all users:", error);
      return [];
    }
  }

  getAllUsernames() {
    try {
      return Object.keys(this.#users);
    } catch (error) {
      console.error("Error while retrieving all users:", error);
      return [];
    }
  }

  getAllUsersArray() {
    try {
      return Object.entries(this.getAllUsers());
    } catch (error) {
      console.error("Error while retrieving all users array:", error);
      return [];
    }
  }

  getMessages(name) {
    try {
      if (name && this.#users[name]) {
        return this.#users[name].messages;
      }
      return [];
    } catch (error) {
      console.error("Error while retrieving messages:", error);
      return [];
    }
  }

  getAllMessages() {
    try {
      let allMessages = [];
      for (const user in this.#users) {
        allMessages = allMessages.concat(this.#users[user].messages);
      }
      return allMessages;
    } catch (error) {
      console.error("Error while retrieving all messages:", error);
      return [];
    }
  }

  getAllMessagesArray() {
    try {
      return Object.entries(this.getAllMessages());
    } catch (error) {
      console.error("Error while retrieving all messages array:", error);
      return [];
    }
  }

  follow(name, nameToFollow) {
    try {
      if (
        name &&
        nameToFollow &&
        this.#users[name] &&
        this.#users[nameToFollow]
      ) {
        if (!this.#users[name].follows.includes(nameToFollow)) {
          this.#users[name].follows.push(nameToFollow);
        }
      }
    } catch (error) {
      console.error("Error while adding a follow:", error);
    }
  }

  getMessagesFromFollows(name) {
    try {
      if (name && this.#users[name]) {
        let messagesFromFollows = [];
        for (const user in this.#users) {
          if (this.#users[name].follows.includes(user)) {
            messagesFromFollows = messagesFromFollows.concat(
              this.#users[user].messages
            );
          }
        }
        return messagesFromFollows;
      }
      return [];
    } catch (error) {
      console.error("Error while retrieving messages from follows:", error);
      return [];
    }
  }

  filterDuplicateMessages() {
    try {
      for (const user in this.#users) {
        const messages = this.#users[user].messages;

        const uniqueMessages = [];
        const uniqueMessageIds = new Set();

        messages.forEach((message) => {
          if (!uniqueMessageIds.has(message.text)) {
            uniqueMessageIds.add(message.text);
            uniqueMessages.push(message);
          }
        });

        this.#users[user].messages = uniqueMessages;
      }
    } catch (error) {
      console.error("Error while filtering duplicate messages:", error);
    }
  }

  getSharedFollows(name, otherName) {
    try {
      if (name && otherName && this.#users[name] && this.#users[otherName]) {
        const follows1 = this.#users[name].follows;
        const follows2 = this.#users[otherName].follows;
        return follows1.filter((follow) => follows2.includes(follow));
      }
      return [];
    } catch (error) {
      console.error("Error while retrieving shared follows:", error);
      return [];
    }
  }

  getSimilarUsers(name, minSimilarity) {
    try {
      if (name && typeof minSimilarity == "number" && this.#users[name]) {
        const similarities = [];
        for (const user in this.#users) {
          if (user !== name) {
            const follows1 = this.#users[name].follows;
            const follows2 = this.#users[user].follows;
            const similarity = follows1.filter((follow) =>
              follows2.includes(follow)
            ).length;
            similarities.push({ user, similarity });
          }
        }
        similarities.sort((a, b) => b.similarity - a.similarity);
        return similarities
          .filter((item) => item.similarity >= minSimilarity)
          .map((item) => item.user);
      }
      return [];
    } catch (error) {
      console.error("Error while retrieving similar users:", error);
      return [];
    }
  }

  getMentionedUsers(message) {
    try {
      if (message) {
        const text = message.text;
        const mentionedUsers = [];
        const regex = /@(\w+)/g;
        let match;
        const uniqueUsers = new Set(); // Use a Set to store unique mentioned users
        while ((match = regex.exec(text)) !== null) {
          const mentionedUser = match[1];
          if (!uniqueUsers.has(mentionedUser)) {
            uniqueUsers.add(mentionedUser);
            mentionedUsers.push(mentionedUser);
          }
        }
        return mentionedUsers;
      }
      return [];
    } catch (error) {
      console.error("Error while retrieving mentioned users:", error);
      return [];
    }
  }

  getHashtags(message) {
    try {
      if (message) {
        const text = message.text;
        const hashtags = [];
        const regex = /#(\w+)/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
          hashtags.push(match[1]);
        }
        return hashtags;
      }
      return [];
    } catch (error) {
      console.error("Error while extracting hashtags:", error);
      return [];
    }
  }

  getMessagesByHashtag(hashtag) {
    try {
      if (hashtag) {
        const messages = this.getAllMessages();
        return messages.filter((message) =>
          this.getHashtags(message.text).includes(hashtag)
        );
      }
      return [];
    } catch (error) {
      console.error("Error while retrieving messages by hashtag:", error);
      return [];
    }
  }

  getTrendingHashtags() {
    try {
      const hashtags = {};
      const messages = this.getAllMessages();

      messages.forEach((message) => {
        const text = message.text;
        const extractedHashtags = this.getHashtags(text);
        const uniqueHashtags = [...new Set(extractedHashtags)];
        uniqueHashtags.forEach((hashtag) => {
          if (hashtags.hasOwnProperty(hashtag)) {
            hashtags[hashtag]++;
          } else {
            hashtags[hashtag] = 1;
          }
        });
      });

      return Object.keys(hashtags).sort((a, b) => hashtags[b] - hashtags[a]);
    } catch (error) {
      console.error("Error while retrieving trending hashtags:", error);
      return [];
    }
  }

  getMessageDate(message) {
    try {
      if (message) {
        const date = message.date;
        return date;
      }
      return null;
    } catch (error) {
      console.error("Error while retrieving message date:", error);
      return null;
    }
  }

  filterMessages(filterParameters) {
    try {
      const messages = this.getAllMessages();

      const filteredMessages = messages.filter((message) => {
        const {
          searchString,
          userName,
          minLength,
          maxLength,
          fromDate,
          toDate,
        } = filterParameters;

        const text = message.text;

        if (searchString && !text.includes(searchString)) {
          return false;
        }

        if (userName && !this.getMessages(userName).includes(message)) {
          return false;
        }

        if (minLength && text.length < minLength) {
          return false;
        }

        if (maxLength && text.length > maxLength) {
          return false;
        }

        if (fromDate && new Date(message.date) < new Date(fromDate)) {
          return false;
        }

        if (toDate && new Date(message.date) > new Date(toDate)) {
          return false;
        }

        return true;
      });

      return filteredMessages;
    } catch (error) {
      console.error("Error while filtering messages:", error);
      return [];
    }
  }
}
