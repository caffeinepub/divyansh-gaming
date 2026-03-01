import List "mo:core/List";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  public type Game = {
    id : Nat;
    title : Text;
    genre : Text;
    description : Text;
    rating : Nat;
    imageUrl : Text;
  };

  module Game {
    public func compare(game1 : Game, game2 : Game) : Order.Order {
      Nat.compare(game1.id, game2.id);
    };
  };

  public type LeaderboardEntry = {
    playerName : Text;
    score : Nat;
    rank : Nat;
    gameName : Text;
  };

  module LeaderboardEntry {
    public func compare(entry1 : LeaderboardEntry, entry2 : LeaderboardEntry) : Order.Order {
      switch (Nat.compare(entry1.rank, entry2.rank)) {
        case (#equal) { Text.compare(entry1.playerName, entry2.playerName) };
	      case (order) { order };
      };
    };
  };

  public type NewsPost = {
    id : Nat;
    title : Text;
    summary : Text;
    date : Text;
  };

  module NewsPost {
    public func compare(post1 : NewsPost, post2 : NewsPost) : Order.Order {
      Nat.compare(post1.id, post2.id);
    };
  };

  let gamesList = List.empty<Game>();
  let leaderboardList = List.empty<LeaderboardEntry>();
  let newsList = List.empty<NewsPost>();

  // Populate with sample data (called at deployment)
  system func preupgrade() {};
  system func postupgrade() {
    // Games
    gamesList.add({
      id = 1;
      title = "Super Action Hero";
      genre = "Action";
      description = "Amazing action-packed adventure.";
      rating = 9;
      imageUrl = "super-action-hero.png";
    });
    gamesList.add({
      id = 2;
      title = "Fantasy RPG";
      genre = "RPG";
      description = "Explore a mystical world of magic and monsters.";
      rating = 8;
      imageUrl = "fantasy-rpg.png";
    });
    gamesList.add({
      id = 3;
      title = "Soccer Star";
      genre = "Sports";
      description = "Become a soccer legend.";
      rating = 7;
      imageUrl = "soccer-star.png";
    });
    gamesList.add({
      id = 4;
      title = "Speed Racer";
      genre = "Racing";
      description = "Race at breakneck speeds.";
      rating = 8;
      imageUrl = "speed-racer.png";
    });
    gamesList.add({
      id = 5;
      title = "Strategy Master";
      genre = "Strategy";
      description = "Test your planning and tactics.";
      rating = 9;
      imageUrl = "strategy-master.png";
    });
    gamesList.add({
      id = 6;
      title = "FPS Elite";
      genre = "FPS";
      description = "First-person shooter action.";
      rating = 8;
      imageUrl = "fps-elite.png";
    });

    // Leaderboard
    leaderboardList.add({
      playerName = "Alice";
      score = 10000;
      rank = 1;
      gameName = "Super Action Hero";
    });
    leaderboardList.add({
      playerName = "Bob";
      score = 9500;
      rank = 2;
      gameName = "Super Action Hero";
    });
    leaderboardList.add({
      playerName = "Charlie";
      score = 9000;
      rank = 3;
      gameName = "Fantasy RPG";
    });
    leaderboardList.add({
      playerName = "Diana";
      score = 8500;
      rank = 4;
      gameName = "Soccer Star";
    });
    leaderboardList.add({
      playerName = "Ethan";
      score = 8000;
      rank = 5;
      gameName = "Speed Racer";
    });
    leaderboardList.add({
      playerName = "Felix";
      score = 7800;
      rank = 6;
      gameName = "Strategy Master";
    });
    leaderboardList.add({
      playerName = "Grace";
      score = 7600;
      rank = 7;
      gameName = "Fantasy RPG";
    });
    leaderboardList.add({
      playerName = "Hank";
      score = 7500;
      rank = 8;
      gameName = "Soccer Star";
    });
    leaderboardList.add({
      playerName = "Irene";
      score = 7400;
      rank = 9;
      gameName = "Speed Racer";
    });
    leaderboardList.add({
      playerName = "Jack";
      score = 7300;
      rank = 10;
      gameName = "FPS Elite";
    });

    // News
    newsList.add({
      id = 1;
      title = "Welcome to DIVYANSH GAMING!";
      summary = "The ultimate gaming destination launches today.";
      date = "2023-03-01";
    });
    newsList.add({
      id = 2;
      title = "New Games Added";
      summary = "Check out the latest titles in our library.";
      date = "2023-03-05";
    });
    newsList.add({
      id = 3;
      title = "Leaderboard Updated";
      summary = "See who's topping the charts this week.";
      date = "2023-03-10";
    });
    newsList.add({
      id = 4;
      title = "Upcoming Tournaments";
      summary = "Get ready to compete in our upcoming events.";
      date = "2023-03-15";
    });
  };

  // Query Functions
  public query ({ caller }) func getGames() : async [Game] {
    gamesList.toArray().sort();
  };

  public query ({ caller }) func getLeaderboard() : async [LeaderboardEntry] {
    leaderboardList.toArray().sort();
  };

  public query ({ caller }) func getNews() : async [NewsPost] {
    newsList.toArray().sort();
  };

  // Update Functions (For Admin)
  public shared ({ caller }) func addGame(game : Game) : async () {
    if (gamesList.values().any(func(g) { g.id == game.id })) {
      Runtime.trap("There is already a game with id " # game.id.toText() # ".");
    };
    gamesList.add(game);
  };

  public shared ({ caller }) func addLeaderboardEntry(entry : LeaderboardEntry) : async () {
    leaderboardList.add(entry);
  };

  public shared ({ caller }) func addNewsPost(post : NewsPost) : async () {
    if (newsList.values().any(func(p) { p.id == post.id })) {
      Runtime.trap("A news post with id " # post.id.toText() # " already exists.");
    };
    newsList.add(post);
  };
};
