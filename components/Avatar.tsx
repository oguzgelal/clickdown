import React, { FC } from "react";
import styled from "styled-components";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { TUser } from "../common/types";

type AvatarProps = {
  user: TUser;
  size?: number;
  className?: string;
  style?: Record<string, unknown>;
  tooltipPlacement?: "left" | "top";
  onClick?: () => void;
  active?: boolean
};

const Avatar: FC<AvatarProps> = ({
  className,
  style,
  user,
  size = 42,
  tooltipPlacement = "left",
  onClick,
  active,
}) => {
  const clickableProps = onClick
    ? {
        role: "button",
        tabIndex: 0,
        onClick,
      }
    : {};

  return (
    <OverlayTrigger
      key={user?.id}
      placement={tooltipPlacement}
      overlay={<Tooltip>{user.username}</Tooltip>}
    >
      <Wrapper
        size={size}
        className={className}
        style={style}
        active={active}
        {...clickableProps}
      >
        {user?.profilePicture && (
          <AvatarImg src={user?.profilePicture} alt={user?.username} />
        )}
        {!user?.profilePicture && user?.initials}
      </Wrapper>
    </OverlayTrigger>
  );
};

export default Avatar;

const Wrapper = styled.div<{
  size: number;
  active?: boolean
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

  ${p => p.active && `
    border: 3px solid var(--bs-primary);
    box-shadow: 0 0 5px rgba(0, 0, 0, .2);
  `}
`;

const AvatarImg = styled.img`
  width: 100%;
`;
