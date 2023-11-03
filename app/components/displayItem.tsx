import { faImage } from '@fortawesome/free-solid-svg-icons'
import styles from './components.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function DisplayItem({item} : {item: ProductData}) {
    return <div className={styles.displayItem}>
        <FontAwesomeIcon className={styles.itemIcon} icon={faImage} size="2xl"/>
        <p>{item.name}</p>
        {item.units.map((value) => <p>{value.name + ": " + value.price}</p>)}
    </div>
}