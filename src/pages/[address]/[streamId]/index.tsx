import React, {
	ReactElement, useEffect, useRef, useState,
} from "react";
import { NextPageWithLayout } from "types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Container from "components/layout/base/Grid/Container";
import FlexRow from "components/layout/base/Grid/FlexRow";
import Col from "components/layout/base/Grid/Col";
import { useTranslation } from "next-i18next";
import PageLayout from "components/layout/site/PageLayout";
import ButtonGroup from "components/base/ButtonGroup";
import Button from "components/base/Button";
import Text from "components/base/Text";
import IconFilter from "components/base/Icon/IconFilter";
import IconSort from "components/base/Icon/IconSort";
import SortPopup from "components/site/popup/SortPopup";
import FilterPopup from "components/site/popup/FilterPopup";
import IndexOperationsPopup from "components/site/popup/IndexOperationsPopup";
import Avatar from "components/base/Avatar";
import LinkInput from "components/site/input/LinkInput";
import IndexDetailsList from "components/site/index-details/IndexDetailsList";
import { useRouter } from "next/router";
import { Indexes, Links } from "types/entity";
import api from "services/api-service";
import IndexTitleInput from "components/site/input/IndexTitleInput";
import { useCeramic } from "hooks/useCeramic";
import { useMergedState } from "hooks/useMergedState";
import moment from "moment";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { copyToClipboard } from "utils/helper";
import IconLink1 from "components/base/Icon/IconLink1";
import IconCopy from "components/base/Icon/IconCopy";
import SearchInput from "components/base/SearchInput";
import NotFound from "components/site/indexes/NotFound";
import { useOwner } from "hooks/useOwner";
import { useAppSelector } from "hooks/store";
import { selectConnection } from "store/slices/connectionSlice";
import { selectProfile } from "store/slices/profileSlice";

const IndexDetailPage: NextPageWithLayout = () => {
	const { t } = useTranslation(["pages"]);
	// const [shareModalVisible, setShareModalVisible] = useState(false);

	const [stream, setStream] = useMergedState<Partial<Indexes>>({});
	const tileDoc = useRef<TileDocument<Indexes>>();
	const [notFound, setNotFound] = useState(false);
	const [crawling, setCrawling] = useState(false);
	const [loading, setLoading] = useState(false);
	const [titleLoading, setTitleLoading] = useState(false);
	const [search, setSearch] = useState("");

	const { address } = useAppSelector(selectConnection);
	const { available, name } = useAppSelector(selectProfile);

	const { isOwner } = useOwner();
	const ceramic = useCeramic();

	const router = useRouter();

	// const handleToggleShareModal = () => {
	// 	setShareModalVisible((oldVal) => !oldVal);
	// };

	const loadStream = async (streamId: string) => {
		const doc = await api.getIndex(streamId);
		if (doc != null) {
			setStream(doc);
			ceramic.getDocById(streamId).then((result) => {
				tileDoc.current = result;
			});
		} else {
			setNotFound(true);
		}
	};

	const handleTitleChange = async (title: string) => {
		setTitleLoading(true);
		const result = await ceramic.updateDoc(stream?.streamId!, {
			title,
		});
		if (result) {
			await api.putIndex({ ...result.content, streamId: result.id.toString() });
		}
		setStream(result.content);
		setTitleLoading(false);
	};

	const handleDelete = () => {
		router.push(`/${address}`);
	};

	const handleAddLink = async (linkUrl: string) => {
		setCrawling(true);
		const link = await api.crawlLink(linkUrl);
		if (link) {
			const [result, newLinks] = await ceramic.addLink(stream?.streamId!, link);
			setStream(result.content);
			if (result) {
				await api.putIndex({ ...result.content, streamId: result.id.toString() });
			}
			await api.crawlLinkContent({
				streamId: stream?.streamId!,
				links: newLinks,
			});
		} else {
			alert("Couldn't get the meta data from url");
		}
		setCrawling(false);
	};

	const handleReorderLinks = async (links: Links[]) => {
		const result = await ceramic.putLinks(stream?.streamId!, links);
		if (result) {
			await api.putIndex({ ...result.content, streamId: result.id.toString() });
		}
		setStream(result.content);
	};

	const handleClone = async () => {
		const originalDoc = await ceramic.getDocById(stream.streamId!);

		const content = { ...originalDoc.content };
		content.clonedFrom = stream.streamId!;

		delete (content as any).address;
		delete (content as any).streamId;

		const doc = await ceramic.createDoc(content);

		if (doc != null) {
			router.push(`/${address}/${doc.streamId.toString()}`);
		}
	};

	useEffect(() => {
		const { streamId } = router.query;
		if (router.query) {
			loadStream(streamId as string);
		} else {
			setNotFound(true);
		}
	}, []);

	return (
		<>
			<Container
				className="index-details-page my-6 my-lg-8"
			>
				{
					notFound ?
						<FlexRow
							rowSpacing={3}
							justify="center"
						>
							<NotFound active={true} />
						</FlexRow> : (
							<>
								<FlexRow
									rowSpacing={3}
									justify="center"
								>
									<Col
										xs={12}
										lg={9}
										noYGutters
									>
										<Avatar randomColor size={20}>{isOwner ? (available && name ? name : "Y") : "O"}</Avatar>
										<Text className="ml-3" size="sm" verticalAlign="middle" fontWeight={500} element="span">{isOwner && available && name ? name : stream?.address}</Text>
									</Col>
									<Col
										xs={12}
										lg={9}
										className="pb-2"
									>
										<FlexRow>
											<Col
												className="idxflex-grow-1 mr-5"
											>
												<IndexTitleInput
													defaultValue={stream?.title || ""}
													onChange={handleTitleChange}
													disabled={!isOwner}
													loading={titleLoading}
												/>
											</Col>
											<Col>

												{

													false ? (
														(address || "").toLowerCase() === router.query.address ? (
															<Button
																addOnBefore
																size="sm"
																theme="clear"
																onClick={() => {
																	copyToClipboard(window.location.href);
																}}
															>
																<IconLink1 stroke="var(--gray-4)" width={12} strokeWidth={"1.5"} />Copy
															</Button>
														) : (
															<Button
																addOnBefore
																size="sm"
																theme="clear"
																onClick={handleClone}
															>
																<IconCopy stroke="var(--gray-4)" width={12} strokeWidth={"1.5"} />Clone
															</Button>
														)
													) : null
												}

											</Col>
											<Col className="ml-3">
												<IndexOperationsPopup
													isOwner={isOwner}
													streamId={stream.streamId!}
													mode="index-detail-page"
													onDelete={handleDelete}
												/>
											</Col>
										</FlexRow>
									</Col>
									<Col xs={12} lg={9} noYGutters className="mb-6">
										<Text size="sm" theme="disabled">{stream?.updatedAt ? `Updated ${moment(stream.updatedAt).fromNow()}` : ""} </Text>
									</Col>
									<Col
										xs={12}
										lg={9}
									>
										<FlexRow>
											<Col
												className="idxflex-grow-1 mr-5"
											>
												<SearchInput
													loading={loading}
													onSearch={setSearch}
													debounceTime={400}
													showClear
													placeholder={t("pages:home.searchLink")} />
											</Col>
											<Col>
												<ButtonGroup
													theme="clear"
												>
													<FilterPopup>
														<Button
															group
															iconButton
														><IconFilter stroke="var(--gray-4)" /></Button>
													</FilterPopup>
													<SortPopup>
														<Button
															group
															iconButton
														><IconSort stroke="var(--gray-4)" /></Button>
													</SortPopup>
												</ButtonGroup>
											</Col>
										</FlexRow>
									</Col>
									{
										isOwner &&	<Col xs={12} lg={9} noYGutters className="pb-0 mt-3">
											<LinkInput
												loading={crawling}
												onLinkAdd={handleAddLink}
											/>
										</Col>
									}
								</FlexRow>
								<FlexRow
									justify="center"
								>
									<Col xs={12} lg={9}>
										<IndexDetailsList
											search={search}
											isOwner={isOwner}
											streamId={router.query.streamId as any}
											links={stream?.links}
											onChange={handleReorderLinks}
										/>
									</Col>
								</FlexRow>
							</>
						)
				}
			</Container>
			{/* <ShareModal data={{}} visible={shareModalVisible} onClose={handleToggleShareModal} /> */}
		</>
	);
};

IndexDetailPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<PageLayout
			hasFooter={false}
			headerType="user"
		>
			{page}
		</PageLayout>
	);
};

export async function getServerSideProps({ locale }: any) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "pages", "components"])),
		},
	};
}
export default IndexDetailPage;
