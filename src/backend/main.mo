import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
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
      switch (Nat.compare(game1.id, game2.id)) {
        case (#equal) { Text.compare(game1.title, game2.title) };
        case (order) { order };
      };
    };
  };

  public type LeaderboardEntry = {
    playerName : Text;
    score : Nat;
    rank : Nat;
    gameName : Text;
    timestamp : Text;
    avatar : Text;
  };

  module LeaderboardEntry {
    public func compare(entry1 : LeaderboardEntry, entry2 : LeaderboardEntry) : Order.Order {
      switch (Nat.compare(entry1.score, entry2.score)) {
        case (#equal) { Text.compare(entry1.playerName, entry2.playerName) };
        case (order) { order };
      };
    };

    public func compareByRank(a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order {
      switch (Nat.compare(a.rank, b.rank)) {
        case (#equal) { Text.compare(a.playerName, b.playerName) };
        case (order) { order };
      };
    };

    public func compareByScoreDescending(a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order {
      switch (Nat.compare(b.score, a.score)) {
        case (#equal) { Text.compare(a.playerName, b.playerName) };
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
      switch (Nat.compare(post1.id, post2.id)) {
        case (#equal) { Text.compare(post1.title, post2.title) };
        case (order) { order };
      };
    };
  };

  let gamesList = List.empty<Game>();
  let leaderboardList = List.empty<LeaderboardEntry>();
  let newsList = List.empty<NewsPost>();

  public query ({ caller }) func getGames() : async [Game] {
    gamesList.toArray().sort();
  };

  public query ({ caller }) func getLeaderboard() : async [LeaderboardEntry] {
    leaderboardList.toArray().sort<LeaderboardEntry>(LeaderboardEntry.compareByScoreDescending);
  };

  public query ({ caller }) func getNews() : async [NewsPost] {
    newsList.toArray().sort();
  };

  public query ({ caller }) func getTopLeaderboard(limit : Nat) : async [LeaderboardEntry] {
    let sorted = leaderboardList.toArray().sort(LeaderboardEntry.compareByScoreDescending);
    sorted.sliceToArray(0, Nat.min(sorted.size(), limit));
  };

  public query ({ caller }) func getLeaderboardByRank() : async [LeaderboardEntry] {
    leaderboardList.toArray().sort<LeaderboardEntry>(LeaderboardEntry.compareByRank);
  };

  public shared ({ caller }) func addGame(game : Game) : async () {
    if (gamesList.values().any(func(g) { g.id == game.id })) {
      Runtime.trap("Game with ID " # game.id.toText() # " already exists.");
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

  public shared ({ caller }) func submitScore(
    playerName : Text,
    score : Nat,
    gameName : Text,
    timestamp : Text,
    avatar : Text,
  ) : async [LeaderboardEntry] {
    let array = leaderboardList.toArray();
    var existingIndex : ?Nat = null;
    var i = 0;
    while (i < array.size() and existingIndex == null) {
      if (array[i].playerName == playerName and array[i].gameName == gameName) {
        existingIndex := ?i;
      };
      i += 1;
    };

    switch (existingIndex) {
      case (null) {
        let newEntry = {
          playerName;
          score;
          rank = 0;
          gameName;
          timestamp;
          avatar = avatar;
        };
        leaderboardList.add(newEntry);
      };
      case (?index) {
        let entriesArray = array;
        let current = entriesArray[index];
        if (score > current.score) {
          let updatedArray = Array.tabulate(
            entriesArray.size(),
            func(i) {
              if (i == index) {
                {
                  playerName;
                  score;
                  rank = 0;
                  gameName;
                  timestamp;
                  avatar = avatar;
                };
              } else {
                entriesArray[i];
              };
            },
          );
          leaderboardList.clear();
          leaderboardList.addAll(updatedArray.values());
        };
      };
    };

    recalculateRanks();
    leaderboardList.toArray().sort<LeaderboardEntry>(LeaderboardEntry.compareByScoreDescending);
  };

  func recalculateRanks() {
    let sortedEntries = leaderboardList.toArray().sort(LeaderboardEntry.compareByScoreDescending);
    var lastScore = 0 : Nat;
    var currentRank = 1 : Nat;
    let updatedEntries = Array.tabulate(
      sortedEntries.size(),
      func(i) {
        let entry = sortedEntries[i];
        let rank = if (entry.score == lastScore) {
          currentRank - 1;
        } else {
          lastScore := entry.score;
          currentRank += 1;
          currentRank - 1;
        };
        {
          entry with rank;
        };
      },
    );
    leaderboardList.clear();
    leaderboardList.addAll(updatedEntries.values());
  };
};
