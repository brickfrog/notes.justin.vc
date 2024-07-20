import { QuartzComponent, QuartzComponentProps } from "./types"
import styles from "./styles/wrapper.scss"

// Local type definition to overload the existing QuartzComponentConstructor
type LocalQuartzComponentConstructor = (...components: QuartzComponent[]) => QuartzComponent

const WrapperComponent: LocalQuartzComponentConstructor = (
  ...components: QuartzComponent[]
): QuartzComponent => {
  if (components.length > 0) {
    const Wrapper: QuartzComponent = (props: QuartzComponentProps) => (
      <div className="wrapper">
        {components.map((Component, index) => (
          <Component key={index} {...props} />
        ))}
      </div>
    )

    Wrapper.displayName = "WrapperComponent"
    Wrapper.css = styles

    return Wrapper
  } else {
    return () => <></> // Empty React fragment for no components case
  }
}

export default WrapperComponent
