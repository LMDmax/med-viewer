import { gql } from "@apollo/client";

export const GET_ANNOTATION = gql`
  query Query($query: LoadAnnotationInput) {
    loadAnnotation(query: $query) {
      success
      message
      data {
        slideId
        type
        version
        originX
        originY
        left
        top
        width
        height
        fill
        stroke
        strokeWidth
        strokeLineCap
        strokeDashOffset
        strokeLineJoin
        strokeMiterLimit
        scaleX
        scaleY
        angle
        flipX
        flipY
        opacity
        visible
        backgroundColor
        fillRule
        paintFirst
        globalCompositeOperation
        skewX
        skewY
        rx
        ry
        hash
        text
        zoomLevel
        tag
        title
        x1
        y1
        x2
        y2
        points {
          x
          y
        }
        path
        cords
        area
        perimeter
        centroid
        end_points
        isAnalysed
        analysedROI
        classType
        isDeleted
        belongsToApp
        createdAt
        updatedAt
      }
    }
  }
`;

export const SAVE_ANNOTATION = gql`
  mutation Mutation($body: CreateAnnotationInput!) {
    autoSaveAnnotation(body: $body) {
      data {
        slideId
        type
        version
        originX
        originY
        left
        top
        width
        height
        fill
        stroke
        strokeWidth
        strokeLineCap
        strokeDashOffset
        strokeLineJoin
        strokeMiterLimit
        scaleX
        scaleY
        angle
        flipX
        flipY
        opacity
        visible
        backgroundColor
        fillRule
        paintFirst
        globalCompositeOperation
        skewX
        skewY
        rx
        ry
        hash
        text
        zoomLevel
        tag
        title
        x1
        y1
        x2
        y2
        points {
          x
          y
        }
        path
        cords
        area
        perimeter
        centroid
        end_points
        isAnalysed
        analysedROI
        classType
        isDeleted
        belongsToApp
        createdAt
        updatedAt
      }
      message
      success
    }
  }
`;

export const UPDATE_ANNOTATION = gql`
  mutation UpdateAnnotation($body: UpdateAnnotationInput) {
    updateAnnotation(body: $body) {
      data {
        slideId
        type
        version
        originX
        originY
        left
        top
        width
        height
        fill
        stroke
        strokeWidth
        strokeLineCap
        strokeDashOffset
        strokeLineJoin
        strokeMiterLimit
        scaleX
        scaleY
        angle
        flipX
        flipY
        opacity
        visible
        backgroundColor
        fillRule
        paintFirst
        globalCompositeOperation
        skewX
        skewY
        rx
        ry
        hash
        text
        zoomLevel
        tag
        title
        x1
        y1
        x2
        y2
        points {
          x
          y
        }
        path
        area
        perimeter
        centroid
        end_points
        isAnalysed
        analysedROI
        classType
        isDeleted
        belongsToApp
        createdAt
        updatedAt
      }
      message
      success
    }
  }
`;

export const DELETE_ANNOTATION = gql`
  mutation DeleteAnnotation($body: DeleteAnnotationInput) {
    deleteAnnotation(body: $body) {
      success
      message
    }
  }
`;

export const ANNOTATIONS_SUBSCRIPTION = gql`
  subscription Subscription($slideId: ID!) {
    changedAnnotations(slideId: $slideId) {
      data {
        slideId
        type
        version
        originX
        originY
        left
        top
        width
        height
        fill
        stroke
        strokeWidth
        strokeLineCap
        strokeDashOffset
        strokeLineJoin
        strokeMiterLimit
        scaleX
        scaleY
        angle
        flipX
        flipY
        opacity
        visible
        backgroundColor
        fillRule
        paintFirst
        globalCompositeOperation
        skewX
        skewY
        rx
        ry
        hash
        text
        zoomLevel
        tag
        title
        x1
        y1
        x2
        y2
        points {
          x
          y
        }
        path
        cords
        area
        perimeter
        centroid
        end_points
        isAnalysed
        analysedROI
        classType
        isDeleted
        belongsToApp
        createdAt
        updatedAt
      }
      status {
        isCreated
        isUpdated
        isDeleted
      }
    }
  }
`;
export const VHUT_ANALYSIS_SUBSCRIPTION = gql`
  subscription Subscription($body: AnalysisInput) {
    analysisStatus(body: $body) {
      status
      message
      data {
        isAnalysed
        analysedROI
        hash
        annotationId
        slideId
      }
      analysisType
    }
  }
`;

export const TIL_ANALYSIS_SUBSCRIPTION = gql`
  subscription Subscription($body: AnalysisInput) {
    tilStatus(body: $body) {
      status
      message
      data {
        lymphocyte_cords
        stroma_cords
        tumor_cords
        slideId
        status
        key_name
        bucket_name
        TILS_score
        lymphocyte_count
        stroma_area
        tumor_area
      }
      analysisType
    }
  }
`;

export const VHUT_ANALTSIS = gql`
  mutation VhutAnalysis($body: VhutBodyInput!) {
    vhutAnalysis(body: $body)
  }
`;

export const VHUT_VIEWPORT_ANALYSIS = gql`
  mutation VhutViewportAnalysis($body: ViewportBodyInput) {
    vhutViewportAnalysis(body: $body)
  }
`;
export const GET_VHUT_ANALYSIS = gql`
  query Query($query: GetAnalysisInput) {
    getVhutAnalysis(query: $query) {
      status
      message
      data {
        analysedData {
          type
          status
          count
          ratio
          total_area
          min_area
          max_area
          avg_area
          total_perimeter
          min_perimeter
          max_perimeter
          avg_perimeter
          centroid_list
          end_points_list
          contours
        }
        annotation
        isDeleted
      }
    }
  }
`;

export const GET_TILS_ANALYSIS = gql`
  query Query($query: GetTilInput) {
    getTils(query: $query) {
      data {
        bucket_name
        key_name
        slideId
        stroma_cords
        lymphocyte_cords
        tumor_cords
        TILS_score
        lymphocyte_count
        stroma_area
        tumor_area
      }
      message
      status
    }
  }
`;
