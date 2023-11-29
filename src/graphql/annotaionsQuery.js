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
        isClosed
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
        createdBy
        updatedAt
        usingAs
      }
    }
  }
`;
export const GET_XMLANNOTATION = gql`
  query Query($query: LoadImportedAnnotationInput) {
    loadImportedAnnotation(query: $query) {
      success
      message
      ImportedAnnotation {
        slideId
        data {
          Id
          localId
          color
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
          Points
          path
          cords
          area
          perimeter
          center
          end_points
          isAnalysed
          analysedROI
          classType
          isDeleted
          belongsToApp
          fontSize
          fontWeight
          fontFamily
          fontStyle
          lineHeight
          underline
          overline
          linethrough
          textAlign
          charSpacing
          minWidth
          splitByGrapheme
          styles
          textBackgroundColor
          createdAt
          updatedAt
        }
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
        isClosed
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
        createdBy
        caseId
        usingAs
        modelName
        patternName
        isProcessed
        processType
        addLocalRegion
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
      deleteType
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
        results {
          type
          contours
        }
        kiResults {
          num_positive
          num_negative
          proliferation_score
          pos_contours
          neg_contours
        }
      }
      analysisType
    }
  }
`;

export const TIL_ANALYSIS_SUBSCRIPTION = gql`
  subscription Subscription($body: AnalysisInput) {
    tilStatus(body: $body) {
      data {
        slideId
        bucket_name
        key_name
        status
        lymphocyte_cords
        TILS_score
        lymphocyte_count
        stroma_area
        tumor_area
        stroma_url
        tumor_url
      }
      message
      status
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
        hash
      }
    }
  }
`;

export const GET_TILS_ANALYSIS = gql`
  query Query($query: GetTilInput) {
    getTils(query: $query) {
      data {
        TILS_score
        bucket_name
        key_name
        lymphocyte_count
        slideId
        status
        stroma_area
        tumor_area
        tumor_url
      }
      message
      status
    }
  }
`;
export const TUMOR_ANALYSIS = gql`
  mutation Mutation($body: segGptMutationInput!) {
    segGpt(body: $body)
  }
`;

export const HITL_INPUT = gql`
  mutation Mutation($body: hilGleasonMutationInput!) {
    hilGleason(body: $body)
  }
`;

export const TUMOR_DETECTION_SUBSCRIPTION = gql`
  subscription ConversionStatus($body: ConversionInput!) {
    conversionStatus(body: $body) {
      status
      message
      data {
        dziUrl
        originalUrl
        key
        slideid
        Version
        bucketName
        coreLength
        gleasonScore
        gradeGroup
        pptTumor
        primaryPattern
        riskCategory
        tumorLength
        worstRemainingPattern
        benign
        gleason3
        gleason4
        gleason5
        Status
        hil {
          dziUrl
          originalUrl
          key
          slideid
          Version
          bucketName
          coreLength
          gleasonScore
          gradeGroup
          pptTumor
          primaryPattern
          riskCategory
          tumorLength
          worstRemainingPattern
          benign
          gleason3
          gleason4
          gleason5
          Status
        }
      }
      type
    }
  }
`;

export const GET_STANDARD_REPORT = gql`
  query Query($query: LoadReportInput) {
    loadReport(query: $query) {
      data {
        clinicalDescription
        grossDescription
        microscopicDescription
        impression
        advise
        annotatedSlides
        uploadedBy
        mediaUrls
      }
      message
      success
    }
  }
`;
export const SAVE_STANDARD_REPORT = gql`
  mutation Mutation($body: CreateReportInput!) {
    autoSaveReport(body: $body) {
      data {
        clinicalDescription
        grossDescription
        microscopicDescription
        impression
        advise
        annotatedSlides
        uploadedBy
        mediaUrls
      }
      message
      success
    }
  }
`;

export const GET_SYNOPTIC_REPORT = gql`
  query LoadSynopticReport($query: LoadReportInput) {
    loadSynopticReport(query: $query) {
      data {
        uploadedBy
        dataRecieved
        specimenType
        specimenRadiographProvided
        radiologyAbnormalitySeen
        rGrade
        radiologyLesion
        specimenWeight
        ellipseOfSkin
        nipple
        histologicalClassificationPresent
        fibrofattyTissue
        lesionMeasures
        site
        macroscopicDistanceToMargin
        comments
        invasiveTumourSize
        wholeTumourSize
        invasiveGrade
        tumourExtent
        type
        typeForComponents
        grade
        associatedDcis
        isSituLobularNeoplasia
        dcisGrade
        isPagetDisease
        isLcis
        pureDcisSize
        pureDcisGrade
        dcisArchitecture
        dcisNecrosis
        microInvasion
        pagetDisease
        typeOfSpecimen
        dateOfRequest
        principalClinician
        siteOfBiopsy
        laterability
        reasonForBiopsy
        involvedSiteOrPatternOfDiseasesSpread
        clinicalOrStagesExtentOfDiseases
        constitutionalSymptoms
        furtherClinicalInformation
        specimenSize
        narrativeOrMicroscopicDescription
        abnormalCells
        abnormalCellSize
        abnormalCellCytomorphology
        abnormalCellProLiferativeIndicators
        immunoHistoChemistry
        flowStudies
        clonality
        whoDiseaseSubType
        ancillaryAbnormalCellSize
        ancillaryCytomorphology
        ancillaryProLiferativeIndicators
        isPreviousHistory
        previousBiopsy
        previousTherapy
        preBiopsySerumPSA
        clinicalSymptoms
        clinicalStage
        leftBaseCores
        leftBaseLength
        leftBaseHistologicalTumourType
        coExistentPathology
        leftMidCores
        leftMidLength
        leftMidHistologicalTumourType
        leftMidGleasonScore
        isUpGrade
        gleasonPattern
        leftMidPerineuralInvasion
        leftMidSeminalInvasion
        leftMidLymphovascularInvasion
        leftMidExtraprostateExtension
        leftMidIntraductualProstate
        leftMidCoexistentExtension
        leftApexCores
        leftApexLength
        leftApexPerineuralInvasion
        leftApexSeminalInvasion
        leftApexLymphovascularInvasion
        leftApexExtraprostateExtension
        leftApexIntraductualProstate
        leftApexCoexistentExtension
        rightBaseCores
        rightBaseLength
        rightMidCores
        rightMidLength
        rightApexCores
        rightApexLength
        reportType
      }
      message
      success
    }
  }
`;

export const SAVE_SYNOPTIC_REPORT = gql`
  mutation Mutation($body: CreateSynopticReportInput!) {
    autoSaveSynopticReport(body: $body) {
      success
      message
      data {
        uploadedBy
        dataRecieved
        specimenType
        specimenRadiographProvided
        radiologyAbnormalitySeen
        rGrade
        radiologyLesion
        specimenWeight
        ellipseOfSkin
        nipple
        histologicalClassificationPresent
        fibrofattyTissue
        lesionMeasures
        site
        macroscopicDistanceToMargin
        comments
        invasiveTumourSize
        wholeTumourSize
        invasiveGrade
        tumourExtent
        type
        typeForComponents
        grade
        associatedDcis
        isSituLobularNeoplasia
        dcisGrade
        isPagetDisease
        isLcis
        pureDcisSize
        pureDcisGrade
        dcisArchitecture
        dcisNecrosis
        microInvasion
        pagetDisease
        typeOfSpecimen
        dateOfRequest
        principalClinician
        siteOfBiopsy
        laterability
        reasonForBiopsy
        involvedSiteOrPatternOfDiseasesSpread
        clinicalOrStagesExtentOfDiseases
        constitutionalSymptoms
        furtherClinicalInformation
        specimenSize
        narrativeOrMicroscopicDescription
        abnormalCells
        abnormalCellSize
        abnormalCellCytomorphology
        abnormalCellProLiferativeIndicators
        immunoHistoChemistry
        flowStudies
        clonality
        whoDiseaseSubType
        ancillaryAbnormalCellSize
        ancillaryCytomorphology
        ancillaryProLiferativeIndicators
        isPreviousHistory
        previousBiopsy
        previousTherapy
        preBiopsySerumPSA
        clinicalSymptoms
        clinicalStage
        leftBaseCores
        leftBaseLength
        leftBaseHistologicalTumourType
        coExistentPathology
        leftMidCores
        leftMidLength
        leftMidHistologicalTumourType
        leftMidGleasonScore
        isUpGrade
        gleasonPattern
        leftMidPerineuralInvasion
        leftMidSeminalInvasion
        leftMidLymphovascularInvasion
        leftMidExtraprostateExtension
        leftMidIntraductualProstate
        leftMidCoexistentExtension
        leftApexCores
        leftApexLength
        leftApexPerineuralInvasion
        leftApexSeminalInvasion
        leftApexLymphovascularInvasion
        leftApexExtraprostateExtension
        leftApexIntraductualProstate
        leftApexCoexistentExtension
        rightBaseCores
        rightBaseLength
        rightMidCores
        rightMidLength
        rightApexCores
        rightApexLength
        reportType
      }
    }
  }
`;
