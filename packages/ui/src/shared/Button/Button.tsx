import "./Button.css";
import { ButtonProps } from "./types";

export const Button = ({
    size,
    color,
    loading = false,
    block = false,
    icon,
    children,
    className,
    disabled,
    ...restProps
}: ButtonProps) => {
    const classes = [
        "game-button",
        size,
        color,
        block && "block",
        loading && "loading",
        !children && icon && "icon",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            className={classes}
            disabled={disabled || loading}
            {...restProps}
        >
            {loading ? (
                <span className="game-button-loader"></span>
            ) : icon ? (
                <span className="game-button-icon-snippet">{icon}</span>
            ) : null}
            {children}
        </button>
    );
};