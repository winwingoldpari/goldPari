import { gql } from '@apollo/client'

export const GET_CASINOS = gql`
  query GetCasinos($category: ItemId, $location: ItemId, $first: IntType) {
    allCasinos(filter: {category: {eq: $category}, loc: {eq: $location}}, first: $first) {
      id
      title
      image {
        url
        alt
        responsiveImage {
          width
          height
        }
      }
    }
  }
`

export const GET_CASINO_BY_ID = gql`
  query GetCasinoById($id: ItemId!) {
    casino(filter: { id: { eq: $id } }) {
      id
      title
      description
      image {
        url
        alt
      }
      rating
      bonus
      link
      features
      createdAt
      updatedAt
    }
  }
`

export const GET_SPORTS = gql`
  query GetSports($sportType: ItemId, $categorySport: ItemId, $location: ItemId, $first: IntType) {
    allSports(filter: {sportType: {eq: $sportType}, category: {eq: $categorySport}, location: {eq: $location}}, first: $first) {
      id
      title
      image {
        url
        alt
        responsiveImage {
          width
          height
        }
      }

    }
  }
`

export const GET_SPORT_BY_ID = gql`
  query GetSportById($id: ItemId!) {
    sport(filter: { id: { eq: $id } }) {
      id
      title
      description
      image {
        url
        alt
      }
      category
      date
      link
      details
      createdAt
      updatedAt
    }
  }
`

// Запрос для получения фильтров
export const GET_FILTERS = gql`
  query GetFilters {
    allCategories(first: 100) {
      title
      id
    }
    allCategorySports(first: 100) {
      title
      id
    }
    allLocations(first: 100) {
      id
      title
    }
    allSportTypes(first: 100) {
      id
      title
    }
  }
`

export const GET_GLOBAL_SETTINGS = gql`
  query GetGlobalSettings {
    globalSetting {
      starterPack
    }
  }
`
