import React from "react";

import { ChevronRightIcon } from "@chakra-ui/icons";
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuItemOption,
	MenuGroup,
	MenuOptionGroup,
	MenuDivider,
	Button,
	Portal,
	Flex,
	Text,
	Box,
	forwardRef,
} from "@chakra-ui/react";

function DisplayMenu({ setZoom }) {
	return (
		<Menu closeOnSelect={false}>
			<MenuButton w="100%">
				<Flex justifyContent="space-between" alignItems="center">
					<Text>Display</Text>
					<ChevronRightIcon />
				</Flex>
			</MenuButton>
			<Portal>
				<MenuList
					pos="relative"
					left="210px"
					bottom="39px"
					borderRadius={0}
					bgColor="#FCFCFC"
					p={0}
				>
					<MenuGroup title="Zoom level" fontWeight={400}>
						<MenuItem
							_hover={{ bgColor: "#DEDEDE" }}
							value="40"
							onClick={() => setZoom(40)}
						>
							40x
						</MenuItem>
						<MenuItem
							_hover={{ bgColor: "#DEDEDE" }}
							value="20"
							onClick={() => setZoom(20)}
						>
							20x
						</MenuItem>
						<MenuItem
							_hover={{ bgColor: "#DEDEDE" }}
							value="10"
							onClick={() => setZoom(10)}
						>
							10x
						</MenuItem>
						<MenuItem
							_hover={{ bgColor: "#DEDEDE" }}
							value="4"
							onClick={() => setZoom(4)}
						>
							4x
						</MenuItem>
						<MenuItem
							_hover={{ bgColor: "#DEDEDE" }}
							value="1"
							onClick={() => setZoom(1)}
						>
							1x
						</MenuItem>
					</MenuGroup>
				</MenuList>
			</Portal>
		</Menu>
	);
}

const SetTagMenu = forwardRef((props, ref) => (
	<Menu>
		<MenuButton ref={ref} {...props}>
			<Flex justifyContent="space-between" alignItems="center">
				<Text>Set Tag</Text>
				<ChevronRightIcon />
			</Flex>
		</MenuButton>
		<Portal>
			<MenuList
				pos="relative"
				left="222px"
				bottom="46px"
				borderRadius={0}
				bgColor="#FCFCFC"
				p={0}
			>
				<MenuOptionGroup fontWeight={400} type="checkbox">
					<MenuItemOption
						_hover={{ bgColor: "#DEDEDE" }}
						value="none"
						closeOnSelect={false}
					>
						None
					</MenuItemOption>
					<MenuItemOption
						_hover={{ bgColor: "#DEDEDE" }}
						value="tumor"
						closeOnSelect={false}
					>
						Tumor
					</MenuItemOption>
					<MenuItemOption
						_hover={{ bgColor: "#DEDEDE" }}
						value="stroma"
						closeOnSelect={false}
					>
						Stroma
					</MenuItemOption>
					<MenuItemOption
						_hover={{ bgColor: "#DEDEDE" }}
						value="immunecells"
						closeOnSelect={false}
					>
						Immune cells
					</MenuItemOption>
					<MenuItemOption
						_hover={{ bgColor: "#DEDEDE" }}
						value="necrosis"
						closeOnSelect={false}
					>
						Necrosis
					</MenuItemOption>
					<MenuItemOption
						_hover={{ bgColor: "#DEDEDE" }}
						value="other"
						closeOnSelect={false}
					>
						Other
					</MenuItemOption>
					<MenuItemOption
						_hover={{ bgColor: "#DEDEDE" }}
						value="addnewtags"
						closeOnSelect={false}
					>
						Add new Tags
					</MenuItemOption>
				</MenuOptionGroup>
			</MenuList>
		</Portal>
	</Menu>
));

export function CustomMenu({
	isMenuOpen,
	closeMenu,
	left,
	top,
	setZoom,
	viewer,
	enableAI,
	runKI67,
	onHandleVhutAnalysis,
	slide,
	onHandleShowAnalysis,
	isMorphometryDisabled,
	isAnalysed,
	handleDeleteAnnotation,
	isAnnotationSelected,
	handleEditOpen,
	handleAnnotationChat,
	application,
	isKI67Analysed,
}) {
	return isMenuOpen ? (
		<Box>
			<Menu isOpen={isMenuOpen}>
				<MenuButton
					as={Button}
					pos="absolute"
					left={left}
					top={top}
					w={0}
					h={0}
				/>

				<MenuList
					borderRadius={0}
					bgColor="#FCFCFC"
					p={0}
					boxShadow="0px 2px 4px rgba(0, 0, 0, 0.15)"
				>
					<MenuItem _hover={{ bgColor: "#DEDEDE" }}>
						<DisplayMenu setZoom={setZoom} />
					</MenuItem>
					{enableAI ? (
						!isAnalysed ? (
							<MenuItem
								_hover={{ bgColor: "#DEDEDE" }}
								onClick={() => {
									onHandleVhutAnalysis();
									closeMenu();
								}}
								closeOnSelect
								isDisabled={isMorphometryDisabled}
							>
								Run Morphometry
							</MenuItem>
						) : (
							<MenuItem
								_hover={{ bgColor: "#DEDEDE" }}
								onClick={() => {
									onHandleShowAnalysis();
									closeMenu();
								}}
								closeOnSelect
							>
								Show Analysis
							</MenuItem>
						)
					) : null}
					{enableAI && slide?.isIHC ? (
						!isKI67Analysed ? (
							<MenuItem
								_hover={{ bgColor: "#DEDEDE" }}
								onClick={() => {
									runKI67();
									closeMenu();
								}}
								closeOnSelect
								isDisabled={isMorphometryDisabled}
							>
								Run KI-67
							</MenuItem>
						) : (
							<MenuItem
								_hover={{ bgColor: "transparent" }}
								disabled={true}
								style={{ cursor: isAnalysed ? 'not-allowed' : 'default' }}
								closeOnSelect
								color="gray.500"
							>
								KI-67 Analysed
							</MenuItem>
						)
					) : null}
					<MenuItem
						_hover={{ bgColor: "#DEDEDE" }}
						onClick={handleEditOpen}
						isDisabled={!isAnnotationSelected}
					>
						Edit
					</MenuItem>
					{application === "hospital" && (
						<MenuItem
							_hover={{ bgColor: "#DEDEDE" }}
							onClick={handleAnnotationChat}
							isDisabled={!isAnnotationSelected}
						>
							Create Query
						</MenuItem>
					)}
					<MenuDivider />
						<MenuItem
							_hover={{ bgColor: "#DEDEDE" }}
						>
							Create Queriiy
						</MenuItem>
					{/* <MenuItem
            _hover={{ bgColor: "#DEDEDE" }}
            onClick={() => setIsOpen(false)}
            isDisabled={!isAnnotationSelected}
          >
            Lock
          </MenuItem> */}
					<MenuItem
						_hover={{ bgColor: "#DEDEDE" }}
						onClick={handleDeleteAnnotation}
						isDisabled={!isAnnotationSelected}
					>
						Delete
					</MenuItem>
				</MenuList>
			</Menu>
		</Box>
	) : null;
}
