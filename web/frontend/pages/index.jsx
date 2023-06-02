import { ResourcePicker } from '@shopify/app-bridge-react';
import {
  Button,
  LegacyCard,
  Modal,
  Page,
  ResourceItem,
  ResourceList,
  Text,
  TextContainer,
  Thumbnail
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";



export default function HomePage() {
  const { t } = useTranslation();
  const [isOpen,setIsOpen] = useState(false);
  const [selectedProducts,setSelectedProducts] = useState([])
  const [currentProduct,setCurrentProduct] = useState()
  const [price,setPrice] = useState("")
  const [active, setActive] = useState(false);




  const handleChange = useCallback(() => setActive(!active), [active]);  
  const handleSelection=(data)=>{
    console.log(data?.selection)
    setSelectedProducts(data.selection)
  }

  const handleUpdate = (item)=>{
    setCurrentProduct(item)
    setPrice(item?.variants[0].price)
    setActive(true)
  }

  const changePriceAction = ()=>{
    setSelectedProducts(selectedProducts.map(item=>{
      if(item.id===currentProduct.id){
        item.variants[0].price = price;
      }
      return item;
    }))
    setActive(!active)
  }
  
  return (

    <div>
    
    <Page
    title="Product Selector"
    primaryAction={{
      content:"Select products",
      onAction:()=> setIsOpen(!isOpen)
    }}
    >

    <ResourcePicker
    resourceType="Product"
    open={isOpen}
    onCancel={()=> setIsOpen(!isOpen)}
    onSelection={(selectPayload)=> handleSelection(selectPayload)}
    />

    <LegacyCard>
      <ResourceList
        resourceName={{singular: 'customer', plural: 'customers'}}
        items={selectedProducts}
        renderItem={(item) => {
          const {id, handle, createdAt,images,variants} = item;
          const price = variants.length>0 ? variants[0].price : "0"
          const media = <Thumbnail
          source={images.length>0? images[0].originalSrc : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRtHdjJ9JCfW6pi7Avk5C9qzydumulLV0jB7TusgWAIL-xOyHiaX5pEmMPH62JqGULxkY&usqp=CAU"}
          alt="Black choker necklace"
        />;

          return (
            <ResourceItem
              id={id}
              //url={url}
              media={media}
              accessibilityLabel={`View details for ${handle}`}
              onClick={()=>console.log(`${handle} ::`)}
            >
              <Text variant="bodyMd" fontWeight="bold" as="h3">
                {handle}
              </Text>
              <div>Created At:{createdAt}</div>

              <p style={{fontWeight:'bold'}}>{price} $</p>
              
              <div style={{marginTop:10}}>
              <Button  primary onClick={()=> handleUpdate(item)}> Update Price </Button>
              </div>
  
              
            </ResourceItem>
          );
        }}
      />
    </LegacyCard>

    </Page>
    <div style={{height: '500px'}}>
      <Modal
        //activator={activator}
        open={active}
        onClose={handleChange}
        title="Change Price"
        primaryAction={{
          content: 'Update',
          onAction: changePriceAction,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleChange,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
          <input
          style={{width:"100%",padding:10,margin:10}}
          type='text'
          label="Product Price"
          value={price}
          onChange={(e) =>  setPrice(e.target.value)}
          //autoComplete="off"
        />
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
    </div>

   

  );
}
