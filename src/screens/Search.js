import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { graphql, QueryRenderer } from "react-relay";
import Colors from "../common/colors";
import RepositoryItem from "../components/RepositoryItem";
import SearchBar from "../components/SearchBar";
import UserBadge from "../components/UserBadge";
import environment from "../relay/environment";

export default class Search extends React.Component {
  static navigationOptions = {
    drawerLabel: () => null
  };

  state = {
    search: "react"
  };

  onSubmit = search => this.setState({ search });

  render = () => (
    <>
      <View style={styles.barView}>
        <UserBadge {...this.props} />
        <SearchBar style={{ marginLeft: 2 }} onSubmit={this.onSubmit} />
      </View>
      {this.state.search ? (
        <View style={styles.searchView}>
          <QueryRenderer
            environment={environment}
            query={query}
            variables={{ search: this.state.search }}
            render={({ error, props }) => {
              if (!props)
                return (
                  <View style={styles.indicatorView}>
                    <ActivityIndicator size="large" />
                  </View>
                );
              if (error) return null;
              return (
                <FlatList
                  data={props.search.nodes}
                  keyExtractor={item => item.id}
                  initialNumToRender={50}
                  renderItem={({ item }) => (
                    <RepositoryItem
                      style={{ marginBottom: 2 }}
                      repository={item}
                    />
                  )}
                />
              );
            }}
          />
        </View>
      ) : null}
    </>
  );
}

const query = graphql`
  query SearchQuery($search: String!, $before: String) {
    search(first: 50, query: $search, type: REPOSITORY, before: $before) {
      nodes {
        ... on Repository {
          id
          ...RepositoryItem_repository
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      repositoryCount
    }
  }
`;

const styles = StyleSheet.create({
  barView: {
    backgroundColor: Colors.lightGrey,
    flexDirection: "row",
    height: 45
  },
  searchView: {
    backgroundColor: Colors.lightGrey,
    flex: 1,
    paddingTop: 2
  },
  indicatorView: {
    flex: 1,
    justifyContent: "center"
  }
});
