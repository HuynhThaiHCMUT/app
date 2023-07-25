import styles from './components.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Link from 'next/link'


interface tabProps {
    href: string,
    text: string,
    icon: IconProp,
}

export default function HeaderTab(props: tabProps) {
    return <Link href={props.href}>
        <div className={styles.headerTab}>
            <FontAwesomeIcon icon={props.icon}/>
            <p>{props.text}</p>
        </div>
    </Link>;
}