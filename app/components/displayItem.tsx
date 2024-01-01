import { faImage } from '@fortawesome/free-solid-svg-icons'
import styles from './components.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CldImage } from 'next-cloudinary'

export default function DisplayItem({product, unit} : {product: ProductData, unit: Unit}) {
    return <div className={styles.displayItem}>
        {(unit.image) ? <CldImage width={150} height={120} src={unit.image} alt={`Image: ${unit.image}`}/> : <FontAwesomeIcon className={styles.itemIcon} icon={faImage} size="2xl"/>}
        <p>{product.name}</p>
        <p>{unit.name}</p>
    </div>
}