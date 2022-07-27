import Col from "components/layout/base/Grid/Col";
import FlexRow from "components/layout/base/Grid/FlexRow";
import Text from "components/base/Text";
import React, { useState } from "react";
import Button from "components/base/Button";
import IconTag from "components/base/Icon/IconTag";
import IconStar from "components/base/Icon/IconStar";
import IconContextMenu from "components/base/Icon/IconContextMenu";
import LogoMini from "components/base/Logo/LogoMini";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import IconDrag from "components/base/Icon/IconDrag";
import Flex from "components/layout/base/Grid/Flex";
import { useBreakpoint } from "hooks/useBreakpoint";
import { BREAKPOINTS } from "utils/constants";
import TagIndexDetailItem from "components/site/tag/TagIndexDetailItem";
import Tooltip from "components/base/Tooltip";
import IndexDetailItemPopup from "components/site/popup/IndexDetailItemPopup";
import { Links } from "types/entity";
import moment from "moment";
import { useRouter } from "next/router";
import { useCeramic } from "hooks/useCeramic";
import sanitize from "sanitize-html";

// TODO: data prop will be Index object
export interface IndexDetailsItemProps extends Links {
	favicon?: string;
	provided?: DraggableProvided;
	snapshot?: DraggableStateSnapshot;
	onChange?(val: Links[]): void;
	search?: boolean;
	isOwner?: boolean;
}

const IndexDetailsItem: React.VFC<IndexDetailsItemProps> = ({
	provided,
	snapshot,
	isOwner,
	id,
	title,
	url,
	updatedAt,
	content,
	favorite,
	tags = [],
	favicon,
	search = false,
	onChange,
}) => {
	const breakpoint = useBreakpoint(BREAKPOINTS, true);

	const [newTag, setNewTag] = useState<boolean>(false);

	const router = useRouter();

	const { streamId } = router.query;

	const ceramic = useCeramic();

	const handleToggleNewTag = () => {
		setNewTag((oldVal) => !oldVal);
	};

	const handleNewTagEdit = async (val?: string | null) => {
		if (val) {
			const doc = await ceramic.addTag(streamId as string, id!, val);
			onChange && onChange(doc?.content?.links || []);
		}
		setNewTag(false);
	};

	const handleSetFavorite = async () => {
		const doc = await ceramic.setLinkFavorite(streamId as string, id!, !favorite);
		onChange && onChange(doc?.content?.links || []);
	};

	const handleRemove = async () => {
		const doc = await ceramic.removeLink(streamId as string, id!);
		onChange && onChange(doc?.content?.links || []);
	};

	const handleRemoveTag = async (tag: string) => {
		const doc = await ceramic.removeTag(streamId as string, id!, tag);
		onChange && onChange(doc?.content?.links || []);
	};

	return (
		<div
			className="index-detail-list-item-wrapper"
			{...(breakpoint === "xs" || breakpoint === "sm" ? (provided && provided.dragHandleProps) : undefined)}
		>
			<FlexRow className="idx-py-6 index-detail-list-item">
				{
					!search && isOwner && !(breakpoint === "xs" || breakpoint === "sm") && (
						<div {...(provided ? provided.dragHandleProps : undefined)}>
							<Flex className="index-detail-list-item-drag-handle">
								<IconDrag
									stroke="#000" fill="#000" />
							</Flex>
						</div>
					)
				}

				<Col xs={12}>
					<FlexRow
						wrap={false}
					>
						<Col
							className="idx-flex-grow-1"
						>
							<a target="_blank" rel="noreferrer" href={url}>
								<Text fontWeight={600} dangerouslySetInnerHTML={{ __html: sanitize(title || "") }}></Text>
							</a>
						</Col>
						{
							!search && isOwner && (
								<Col className="idx-flex-shrink-0 idx-ml-3 index-detail-list-item-buttons">
									<FlexRow>
										<Col>
											<Tooltip content="Add Tag">
												<Button
													size="xs"
													iconButton
													theme="clear"
													borderless
													onClick={handleToggleNewTag}
												>
													<IconTag />
												</Button>
											</Tooltip>
										</Col>
										<Col>
											<Tooltip content="Favorite">
												<Button
													size="xs"
													iconButton
													theme="clear"
													borderless
													onClick={handleSetFavorite}
												>
													<IconStar fill={favorite ? "var(--blue)" : "none"} stroke={favorite ? "var(--blue)" : undefined}/>
												</Button>
											</Tooltip>
										</Col>
										<Col>
											<IndexDetailItemPopup onDelete={handleRemove}>
												<Button
													size="xs"
													iconButton
													theme="clear"
													borderless><IconContextMenu /></Button>
											</IndexDetailItemPopup>
										</Col>
									</FlexRow>
								</Col>
							)
						}
					</FlexRow>
				</Col>
				<Col xs={12} className="idx-mt-3">
					<a target="_blank" rel="noreferrer" href={url}>
						{favicon ?
							<img
								className="idx-mr-3"
								src={favicon}
								alt="favicon"
								width={16}
								height={16}
								style={{
									verticalAlign: "middle",
								}} /> :
							<LogoMini
								className="idx-mr-3"
								width={16}
								height={16}
								style={{
									verticalAlign: "middle",
								}} />}<Text size="sm" theme="disabled">{url} • {updatedAt ? moment(updatedAt).format("MMM D") : ""}</Text>
					</ a>
				</Col>
				{
					search && content && (
						<Col className="idx-mt-5">
							<Text theme="secondary" dangerouslySetInnerHTML={{ __html: sanitize(content || "") }}></Text>
						</Col>
					)
				}
				<Col>
				</Col>
				{
					!search && <Col xs={12} className="idx-mt-3 idx-flex idx-flex-gap-3 idx-flex-wrap">
						{
							tags.map((t, ind) => (
								<TagIndexDetailItem
									key={ind}
									text={t}
									removable
									onRemove={handleRemoveTag}
								/>))
						}
						{
							newTag && <TagIndexDetailItem
								theme="clear"
								text=""
								placeholder="New Tag"
								editable={true}
								inputActive
								onEdit={handleNewTagEdit}
							/>
						}
					</Col>
				}
			</FlexRow>
		</div>
	);
};
export default IndexDetailsItem;