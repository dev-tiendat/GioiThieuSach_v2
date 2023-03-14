import React from 'react';
import { WebView } from 'react-native-webview';
import { LinkToBookScreenProps } from '../../navigation/types';

const LinkToBookScreen : React.FC<LinkToBookScreenProps> = ({route}) => {
  return <WebView source={{ uri: route.params.link}} />;
}

export default LinkToBookScreen
