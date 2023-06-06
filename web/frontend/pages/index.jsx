import { ResourcePicker } from '@shopify/app-bridge-react';
import {
  Button,
  Frame,
  LegacyCard,
  Modal,
  Page,
  ResourceItem,
  ResourceList,
  Text,
  TextContainer,
  Thumbnail,
  Toast
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthenticatedFetch } from '../hooks';


export default function HomePage() {
  const { t } = useTranslation();
  const [isOpen,setIsOpen] = useState(false);
  const [selectedProducts,setSelectedProducts] = useState([])
  const [currentProduct,setCurrentProduct] = useState()
  const [price,setPrice] = useState("")
  const [active, setActive] = useState(false);
  const [activeToast, setActiveToast] = useState(false);

  const fetch = useAuthenticatedFetch();

  // const {data} = useAppQuery({
  //   url: `/api/products/count`,
  //   reactQueryOptions: {
  //     /* Disable refetching because the QRCodeForm component ignores changes to its props */
  //     refetchOnReconnect: false,
  //   },
  // });

  // console.log(data)

  const handleChange = useCallback(() => setActive(!active), [active]);  
  const toggleActive = useCallback(() => setActiveToast((activeToast) => !activeToast), []);
  const toastMarkup = activeToast ? (
    <Toast content="Product Price Updated" onDismiss={toggleActive} />
  ) : null;

  const handleSelection=(data)=>{
    console.log(data?.selection)
    setSelectedProducts(data.selection)
  }

  const handleUpdate = (item)=>{
    console.log(item)
    setCurrentProduct(item)
    setPrice(item?.variants[0].price)
    setActive(true)

  }

  const changePriceAction = async()=>{


    const productId = currentProduct.id;
    console.log("Current:",currentProduct.variants[0].price)

    let updatedProductData = {...currentProduct};
    updatedProductData.variants[0].price = price;
    console.log("Updated:",updatedProductData.variants[0].price);

    console.log("Current:",currentProduct.variants[0].price)
 
    const response = await fetch(`/api/products/update`,
    {
      method:"PUT",
      headers:{
        Accept:"application/json",
        "Content-Type":"application/json",
      },
      body:JSON.stringify(updatedProductData)
    });
    if(response.ok){
      console.log(response.data);
    }

     setSelectedProducts(selectedProducts.map(item=>{
      if(item.id===currentProduct.id){
        item.variants[0].price = price;
      }
      return item;
    }))

    setActive(!active)
    setActiveToast(true);
    // const shopifyDomain = 'quick-start-2ecc5be6.myshopify.com';
    // const accessToken = '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';
    
    
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
    <div style={{height: '250px'}}>
      <Frame>
          {toastMarkup}
      </Frame>
    </div>

    </div>

   

  );
}
