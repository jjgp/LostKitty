import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { graphql, QueryRenderer } from 'react-relay';
import Colors from '../common/colors';
import SearchResults from '../components/SearchResults';
import SearchBar from '../components/SearchBar';
import UserBadge from '../components/UserBadge';
import environment from '../api/v4/environment';

export default class Search extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    query: 'react',
  };

  _onSubmit = query => this.setState({ query });

  _renderActivityIndicator = () => (
    <View style={styles.indicatorView}>
      <ActivityIndicator size="large" />
    </View>
  );

  _renderBarView = () => (
    <View style={styles.barView}>
      <SearchBar onSubmit={this._onSubmit} />
      <View style={{ width: 10 }} />
      <UserBadge
        {...this.props}
        onPress={() => this.props.navigation.navigate('Settings')}
      />
    </View>
  );

  render = () => (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.lightGrey }}>
      {this._renderBarView()}
      {this.state.query ? (
        <View style={styles.searchView}>
          <QueryRenderer
            environment={environment}
            query={query}
            render={({ error, props }) => {
              if (!props) return this._renderActivityIndicator();
              if (error) {
                console.log(error);
                return <Text>{error}</Text>;
              }
              return (
                <SearchResults
                  navigation={this.props.navigation}
                  results={props}
                />
              );
            }}
            variables={{ query: this.state.query, type: 'REPOSITORY' }}
            variables={{ query: this.state.query, type: 'REPOSITORY' }}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const query = graphql`
  query SearchQuery($cursor: String, $query: String!, $type: SearchType!) {
    ...SearchResults_results @arguments(query: $query, type: $type)
  }
`;

const styles = StyleSheet.create({
  barView: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    height: 55,
    padding: 10,
  },
  indicatorView: {
    flex: 1,
    justifyContent: 'center',
  },
  searchView: {
    backgroundColor: Colors.lightGrey,
    flex: 1,
    paddingTop: 2,
  },
});
