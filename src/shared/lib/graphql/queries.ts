import { graphql } from './__generated__'

export const GET_CASINOS = graphql(`
  query GetCasinos($category: [ItemId!], $casinoType: [ItemId!], $location: [ItemId!], $publishedAtGte: DateTime, $publishedAtLt: DateTime, $first: IntType) {
    allCasinos(filter: {category: {in: $category}, categoryType: {in: $casinoType}, loc: {anyIn: $location}, _publishedAt: {gte: $publishedAtGte, lt: $publishedAtLt}}, first: $first) {
      id
      title
      _publishedAt
      category {
        id
        title
      }
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
`)

export const GET_CASINO_STORIES = graphql(`
  query GetCasinoStories($category: [ItemId!], $casinoType: [ItemId!], $location: [ItemId!], $publishedAtGte: DateTime, $publishedAtLt: DateTime, $first: IntType) {
    allCasinoStories(filter: {category: {in: $category}, categoryType: {in: $casinoType}, loc: {anyIn: $location}, _publishedAt: {gte: $publishedAtGte, lt: $publishedAtLt}}, first: $first) {
      id
      title
      _publishedAt
      category {
        id
        title
      }
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
`)

export const GET_SPORTS = graphql(`
  query GetSports($sportType: [ItemId!], $categorySport: [ItemId!], $location: [ItemId!], $publishedAtGte: DateTime, $publishedAtLt: DateTime, $first: IntType) {
    allSports(filter: {sportType: {in: $sportType}, category: {in: $categorySport}, location: {anyIn: $location}, _publishedAt: {gte: $publishedAtGte, lt: $publishedAtLt}}, first: $first) {
      id
      title
      _publishedAt
      category {
        id
        title
      }
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
`)

export const GET_SPORT_STORIES = graphql(`
  query GetSportStories($sportType: [ItemId!], $categorySport: [ItemId!], $location: [ItemId!], $publishedAtGte: DateTime, $publishedAtLt: DateTime, $first: IntType) {
    allSportStories(
      filter: {sportType: {in: $sportType}, category: {in: $categorySport}, location: {anyIn: $location}, _publishedAt: {gte: $publishedAtGte, lt: $publishedAtLt}}
      first: $first
    ) {
      id
      title
      _publishedAt
      category {
        id
        title
      }
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
`)

export const GET_FILTERS = graphql(`
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
    allCreativeFormats(first: 100) {
      id
      title
    }
    allUniversalCategories(first: 100) {
      id
      title
    }
    allCasinoTypes(first: 100) {
      id
      title
    }
  }
`)

export const GET_GLOBAL_SETTINGS = graphql(`
  query GetGlobalSettings {
    globalSetting {
      starterPack
      feedback
      link
      sendRequest
    }
  }
`)

export const GET_UNIVERSALS = graphql(`
  query GetUniversals($universalCategory: [ItemId!], $creativeFormat: [ItemId!], $location: [ItemId!], $publishedAtGte: DateTime, $publishedAtLt: DateTime, $first: IntType) {
    allUniversals(filter: {category: {in: $universalCategory}, format: {in: $creativeFormat}, local: {anyIn: $location}, _publishedAt: {gte: $publishedAtGte, lt: $publishedAtLt}}, first: $first) {
      id
      title
      _publishedAt
      category {
        id
        title
      }
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
`)
