import Microblog from "./Microblog.js";

const microblog = new Microblog();

// Dummy data
microblog.addUser("Mike");
microblog.addUser("Zoe");
microblog.addUser("Alex");
microblog.addUser("Pete");
microblog.addUser("Ida");

microblog.addMessage("Mike", "Hello @Zoe!");
microblog.addMessage("Mike", "Holiday time! #mykonos");
microblog.addMessage("Zoe", "Tickets booked! @Alex");
microblog.addMessage("Zoe", "Anothe challenge solved! #javascript");
microblog.addMessage("Alex", "First day at work, wish me luck! #javascript");

microblog.follow("Pete", "Alex");
microblog.follow("Pete", "Mike");
microblog.follow("Ida", "Alex");
microblog.follow("Mike", "Zoe");
microblog.follow("Zoe", "Alex");
microblog.follow("Alex", "Pete");

console.dir(microblog);
