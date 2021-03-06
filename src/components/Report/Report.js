import React from "react";
import {
  Box,
  Text,
  Flex,
  useMediaQuery,
  Icon,
  HStack,
  VStack,
  Input,
  Textarea,
  Image,
} from "@chakra-ui/react";
import { BiGridHorizontal } from "react-icons/bi";
import { GrFormClose } from "react-icons/gr";

const Report = ({
  handleReport,
  report,
  caseInfo,
  reportData,
  handleReportData,
  handleUpload,
  annotedSlideImages,
  reportedData,
}) => {
  const [ifwidthLessthan1920] = useMediaQuery("(max-width:1920px)");
  const handleReportClose = () => {
    handleReport();
  };

  return (
    <Flex
      fontSize="12px"
      fontFamily="inter"
      minW="400px"
      width="33.281vw"
      height="100%"
      top={ifwidthLessthan1920 ? "90px" : "9.999vh"}
      pos="fixed"
      right="0px"
      bg="#FCFCFC"
      flexDirection="column"
      display={report ? "flex" : "none"}
    >
      <Flex
        py="0.5px"
        justifyContent="flex-end"
        alignItems="center"
        background="#F6F6F6"
      >
        <GrFormClose
          size={16}
          cursor="pointer"
          onClick={handleReportClose}
          _hover={{ cursor: "pointer" }}
        />
      </Flex>
      <Flex
        bg="#fff"
        minH="32px"
        h="2.962vh"
        justifyContent="center"
        alignItems="center"
        boxShadow="1px 1px 2px rgba(176, 200, 214, 0.25)"
      >
        {/* <Icon as={BiGridHorizontal} color="#AEAEAE" w="2vw" h="20vw" /> */}
      </Flex>
      <Flex
        bg="#fff"
        mt="0.5vw"
        h="77vh"
        mr="0.7333vw"
        pl="1.666vw"
        // pb="1vh"
        pr="0.8333vw"
        direction="column"
        overflow="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#C4C4C4",
          },
        }}
      >
        {/* <Flex border=" 1px solid #fff" bg="#fff" w="100%">
          <Text borderBottom="1px solid #000" w="100%" fontWeight="600">
            {caseInfo?.treatingHospitalDetails?.hospitalName}
          </Text>
        </Flex> */}
        <Flex
          mt="1.1vh"
          w="100%"
          pr="3.4895vw"
          borderBottom="1px solid #000"
          pb="1.5vh"
        >
          <VStack w="100%" border="1px solid #DEDEDE">
            <HStack w="100%">
              <HStack minW="50%" py="0.7vh" borderRight="1px solid #DEDEDE">
                <Text pl="0.5208vw">Name:</Text>
                <Text pr="0.5208vw">
                  {caseInfo?.patient?.patientName?.firstName}
                  {caseInfo?.patient?.patientName?.lastName}
                </Text>
              </HStack>
              <HStack minW="50%">
                <Text>UHID:</Text>
                <Text pr="0.5208vw" />
              </HStack>
            </HStack>
            <HStack
              w="100%"
              borderTop="1px solid #DEDEDE"
              mt="-0rem !important"
            >
              <HStack minW="50%" py="0.7vh" borderRight="1px solid #DEDEDE">
                <Text pl="0.5208vw">Gender/Age:</Text>
                <Text pr="0.5208vw">
                  {`${caseInfo?.patient?.gender}/${caseInfo?.patient?.age?.years}`}
                </Text>
              </HStack>
              <HStack minW="50%">
                <Text>Clinician:</Text>
                <Text pr="0.5208vw">{caseInfo?.treatingDoctor}</Text>
              </HStack>
            </HStack>
            <HStack
              w="100%"
              borderTop="1px solid #DEDEDE"
              mt="-0rem !important"
            >
              <HStack minW="50%" py="0.7vh" borderRight="1px solid #DEDEDE">
                <Text pl="0.5208vw" isTruncated>
                  Contact No:
                </Text>
                <Text pr="0.5208vw"> {caseInfo?.patient?.contactNumber}</Text>
              </HStack>
              <HStack minW="50%">
                <Text>Clinician???s No:</Text>
                <Text pr="0.5208vw" />
              </HStack>
            </HStack>
            <HStack
              w="100%"
              borderTop="1px solid #DEDEDE"
              mt="-0rem !important"
            >
              <HStack
                minW="50%"
                h="100%"
                py="0.7vh"
                borderRight="1px solid #DEDEDE"
              >
                <Text pl="0.5208vw">Address:</Text>
                <Text pr="0.5208vw">{caseInfo?.patient?.patientAddress}</Text>
              </HStack>
              <HStack minW="50%" h="100%">
                <Text>Hospital:</Text>
                <Text pr="0.5208vw" isTruncated>
                  {caseInfo?.treatingHospitalDetails?.hospitalName}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Flex>
        <Flex pt="1.7vh" flexDirection="column">
          <Text fontWeight="600">HISTOPATHOLOGY FINAL DIAGNOSIS REPORT</Text>
          <HStack pt="1.29vh" justifyContent="space-between">
            <HStack>
              <Text fontWeight="600" isTruncated>
                CASE NUMBER:
              </Text>
              <Text ml="0.1rem !important">{caseInfo?.caseName}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="600">DEPARTMENT:</Text>
              <Text ml="0.1rem !important">{caseInfo?.departmentFrom}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="600">ORGAN:</Text>
              <Text ml="0.1rem !important">
                {caseInfo?.organs[0]?.organName}
              </Text>
            </HStack>
          </HStack>
          <VStack
            justifyContent="space-around"
            alignItems="flex-start"
            pt="1.29vh"
          >
            <HStack position="relative">
              <Box pl="0.2vw" maxW="30vw">
                <Text isTruncated fontWeight="600">
                  CLINICAL STUDY:
                </Text>
                {reportedData?.length > 0 ? (
                  <Text>{reportedData?.[0].clinicalStudy}</Text>
                ) : (
                  <>
                    <Textarea
                      onChange={handleReportData("clinicalStudy")}
                      defaultValue={reportData.clinicalStudy}
                      h="full"
                      minH="12px"
                      position="absolute"
                      overflow="hidden"
                      resize="none"
                      border="none"
                      size="xs"
                      outline="none"
                      _focus={{ outline: "none" }}
                      p="0"
                    />

                    <Textarea
                      visibility="hidden"
                      minH="12px"
                      size="xs"
                      as="div"
                      whiteSpace="pre-wrap"
                      h="auto"
                      p="0"
                    >
                      {reportData?.clinicalStudy}
                    </Textarea>
                  </>
                )}
              </Box>
            </HStack>
            <HStack position="relative">
              <Box pl="0.2vw" maxW="30vw">
                <Text isTruncated fontWeight="600" w="100%">
                  GROSS DESCRIPTION:
                </Text>
                {reportedData?.length > 0 ? (
                  <Text>{reportedData?.[0]?.grossDescription}</Text>
                ) : (
                  <>
                    <Textarea
                      onChange={handleReportData("grossDescription")}
                      defaultValue={reportData.grossDescription}
                      w="100%"
                      h="full"
                      minH="12px"
                      position="absolute"
                      overflow="hidden"
                      resize="none"
                      border="none"
                      size="xs"
                      outline="none"
                      _focus={{ outline: "none" }}
                      p="0"
                    />

                    <Textarea
                      visibility="hidden"
                      minH="12px"
                      size="xs"
                      as="div"
                      w="100%"
                      whiteSpace="pre-wrap"
                      h="auto"
                      p="0"
                    >
                      {reportData?.grossDescription}
                    </Textarea>
                  </>
                )}
              </Box>
            </HStack>
            <HStack position="relative">
              <Box pl="0.2vw" maxW="30vw">
                <Text isTruncated fontWeight="600">
                  MICROSCOPIC DESCRIPTION:
                </Text>
                {reportedData?.length > 0 ? (
                  <Text>{reportedData?.[0]?.microscopicDescription}</Text>
                ) : (
                  <>
                    <Textarea
                      onChange={handleReportData("microscopicDescription")}
                      defaultValue={reportData?.microscopicDescription}
                      h="full"
                      minH="12px"
                      position="absolute"
                      overflow="hidden"
                      resize="none"
                      border="none"
                      size="xs"
                      outline="none"
                      _focus={{ outline: "none" }}
                      p="0"
                    />
                    <Textarea
                      visibility="hidden"
                      minH="12px"
                      size="xs"
                      as="div"
                      whiteSpace="pre-wrap"
                      h="auto"
                      p="0"
                    >
                      {reportData?.microscopicDescription}
                    </Textarea>
                  </>
                )}
              </Box>
            </HStack>
            <HStack position="relative">
              <Box pl="0.2vw" maxW="30vw">
                <Text isTruncated fontWeight="600">
                  IMPRESSION:
                </Text>
                {reportedData?.length > 0 ? (
                  <Text>{reportedData?.[0]?.impression}</Text>
                ) : (
                  <>
                    <Textarea
                      onChange={handleReportData("impression")}
                      defaultValue={reportData?.impression}
                      h="full"
                      minH="12px"
                      position="absolute"
                      overflow="hidden"
                      resize="none"
                      border="none"
                      size="xs"
                      outline="none"
                      _focus={{ outline: "none" }}
                      p="0"
                    />
                    <Textarea
                      visibility="hidden"
                      minH="12px"
                      size="xs"
                      as="div"
                      whiteSpace="pre-wrap"
                      h="auto"
                      p="0"
                    >
                      {reportData?.impression}
                    </Textarea>
                  </>
                )}
              </Box>
            </HStack>
            <HStack position="relative">
              <Box pl="0.2vw" maxW="30vw">
                <Text isTruncated fontWeight="600">
                  ADVICE:
                </Text>
                {reportedData?.length > 0 ? (
                  <Text>{reportedData?.[0]?.advise}</Text>
                ) : (
                  <>
                    <Textarea
                      onChange={handleReportData("advice")}
                      defaultValue={reportData?.advice}
                      h="full"
                      minH="12px"
                      position="absolute"
                      overflow="hidden"
                      resize="none"
                      border="none"
                      size="xs"
                      outline="none"
                      _focus={{ outline: "none" }}
                      p="0"
                    />
                    <Textarea
                      visibility="hidden"
                      minH="12px"
                      size="xs"
                      as="div"
                      whiteSpace="pre-wrap"
                      h="auto"
                      p="0"
                    >
                      {reportData?.advice}
                    </Textarea>
                  </>
                )}
              </Box>
            </HStack>
            <HStack position="relative">
              <Box pl="0.2vw" maxW="30vw">
                <Text isTruncated fontWeight="600">
                  ANNOTED SLIDES:
                </Text>
                {reportedData?.length > 0 ? (
                  <Text>{reportedData?.[0]?.annotedSlides}</Text>
                ) : (
                  <>
                    <Textarea
                      onChange={handleReportData("annotedSlides")}
                      defaultValue={reportData?.annotedSlides}
                      h="full"
                      minH="12px"
                      position="absolute"
                      overflow="hidden"
                      resize="none"
                      border="none"
                      size="xs"
                      outline="none"
                      _focus={{ outline: "none" }}
                      p="0"
                    />

                    <Textarea
                      visibility="hidden"
                      minH="12px"
                      size="xs"
                      as="div"
                      whiteSpace="pre-wrap"
                      h="auto"
                      p="0"
                    >
                      {reportData?.annotedSlides}
                    </Textarea>
                  </>
                )}
              </Box>
            </HStack>
            <Flex w="100%" pt="2vh" alignItems="flex-start" flexWrap="wrap">
              {reportedData?.length > 0
                ? reportedData?.[0]?.mediaURLs?.map((url) => {
                    return (
                      <Image
                        key={url}
                        src={url}
                        alt=""
                        minW="7.239vw"
                        maxW="7.239vw"
                        m="1vw"
                      />
                    );
                  })
                : annotedSlideImages.map((image) => (
                    <Image
                      key={image.name}
                      src={URL.createObjectURL(image)}
                      alt=""
                      minW="7.239vw"
                      maxW="7.239vw"
                      m="1vw"
                    />
                  ))}
            </Flex>
            {!reportedData?.length > 0 && (
              <Flex
                borderRadius="0px"
                fontSize="12px"
                bgColor="light.500"
                border="1px solid #3B5D7C"
                color="light.700"
                ml="0.3vw"
                position="relative"
                py="0.833vh"
                px="0.937vw"
                alignItems="center"
              >
                <Input
                  type="file"
                  opacity="0"
                  css={{ width: "100%", position: "absolute" }}
                  onInput={handleUpload}
                  accept=".jpeg,.jpg,.png"
                  multiple
                />
                Upload Images
              </Flex>
            )}
          </VStack>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Report;
