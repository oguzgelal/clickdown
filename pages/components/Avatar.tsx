import React, { FC } from "react";
import styled from "styled-components";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { TUser } from "../../common/types";

type AvatarProps = {
  user: TUser;
  size?: number;
  className?: string;
  style?: Record<string, unknown>;
  tooltipPlacement?: "left" | "top";
};

const Wrapper = styled.div<{
  size: number;
}>`
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid var(--bs-gray-200);
  background-color: var(--bs-gray-100);
  font-size: 13px;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  overflow: hidden;
  font-weight: bold;
  color: gray;
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const Avatar: FC<AvatarProps> = ({
  className,
  style,
  user,
  size = 42,
  tooltipPlacement = "left",
}) => {
  return (
    <OverlayTrigger
      key={user?.id}
      placement={tooltipPlacement}
      overlay={<Tooltip>{user.username}</Tooltip>}
    >
      <Wrapper size={size} className={className} style={style}>
        {user?.profilePicture && (
          <AvatarImg src={user?.profilePicture} alt={user?.username} />
        )}
        {!user?.profilePicture && user?.initials}
      </Wrapper>
    </OverlayTrigger>
  );
};

export default Avatar;
