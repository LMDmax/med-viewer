import { gql } from "@apollo/client";

export const GET_ADJUSTMENT_RESULT = gql`
  query LoadAdjustmentInput($query: LoadAdjustmentInput) {
    loadAdjustment(query: $query) {
      data {
        brightness
        contrast
        gamma
        thresholding
        slideId
      }
      message
      success
    }
  }
`;

export const FILTER_DATA = gql`
mutation Mutation($body: CreateAdjustmentInput!) {
  autoSaveAdjustment(body: $body) {
    data {
      brightness
      contrast
      gamma
      thresholding
      slideId
    }
    message
    success
  }
}`;