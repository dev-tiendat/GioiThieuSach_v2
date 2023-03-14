import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Post } from '../constants/interface';

type BottomTabNavigatorParamList = {
  Home: undefined;
  Favourite: undefined;
  User: undefined;
  Posts: undefined;
};


type RootStackParamList = {
  Splash: undefined;
  BottomTab: NavigatorScreenParams<BottomTabNavigatorParamList>;
  Onboarding: undefined;
  Test: undefined;
  SignIn: undefined;
  ForgotPassword: undefined;
  RegisterByEmail: undefined;
  PhoneAuth: undefined;
  Vertification: {
    confirmation: FirebaseAuthTypes.ConfirmationResult;
    phoneNumber: string;
  };
  WelcomeUser: undefined;
  CreatePostScreen: undefined;
  EditProfile: undefined;
  EditPost: {
    post: Post;
  };
  BookDetails: {
    postId: string;
  };
  LinkToBook: {
    link: string;
  };
  PostComment: {
    postId: string;
    bookTitle: string;
  };
};

type BottomTabProps = BottomTabScreenProps<BottomTabNavigatorParamList>;

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigatorParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

type PostsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigatorParamList, 'Posts'>,
  NativeStackScreenProps<RootStackParamList>
>;

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

type RegisterByEmailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RegisterByEmail'
>;

type ForgotPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ForgotPassword'
>;

type VertificationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Vertification'
>;

type PhoneAuthScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PhoneAuth'
>;

type WelcomeUserScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WelcomeUser'
>;

type EditPostScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EditPost'
>;

type LinkToBookScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LinkToBook'
>;

type PostCommentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PostComment'
>;

type FavoriteScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigatorParamList, 'Favourite'>,
  NativeStackScreenProps<RootStackParamList>
>;


export type {
  RootStackParamList,
  BottomTabProps,
  BottomTabNavigatorParamList,
  HomeScreenProps,
  SignInScreenProps as SignInProps,
  RegisterByEmailScreenProps,
  ForgotPasswordScreenProps,
  VertificationScreenProps,
  PhoneAuthScreenProps,
  WelcomeUserScreenProps,
  PostsScreenProps,
  EditPostScreenProps,
  LinkToBookScreenProps,
  PostCommentScreenProps,
  FavoriteScreenProps,
};
