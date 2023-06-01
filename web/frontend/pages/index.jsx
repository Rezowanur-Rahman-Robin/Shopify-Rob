import { ResourcePicker } from '@shopify/app-bridge-react';
import {
  LegacyCard,
  Page,
  ResourceItem,
  ResourceList,
  Text,
  Thumbnail
} from "@shopify/polaris";
import { useState } from "react";
import { useTranslation } from "react-i18next";



export default function HomePage() {
  const { t } = useTranslation();
  const [isOpen,setIsOpen] = useState(false);
  const [selectedProducts,setSelectedProducts] = useState([])
  
  
  const handleSelection=(data)=>{
    console.log(data?.selection)
    setSelectedProducts(data.selection)
  }
  
  return (

    <Page
    title="Product Selector"
    primaryAction={{
      content:"Select products",
      onAction:()=> setIsOpen(true)
    }}
    >

    <ResourcePicker
    resourceType="Product"
    open={isOpen}
    onCancel={()=> setIsOpen(false)}
    onSelection={(selectPayload)=> handleSelection(selectPayload)}
    />

    <LegacyCard>
      <ResourceList
        resourceName={{singular: 'customer', plural: 'customers'}}
        items={selectedProducts}
        renderItem={(item) => {
          const {id, handle, createdAt,images} = item;
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
            </ResourceItem>
          );
        }}
      />
    </LegacyCard>

    </Page>

    // <Page narrowWidth>
    //   <TitleBar title={t("HomePage.title")} primaryAction={null} />
    //   <Layout>
    //     <Layout.Section>
    //     <Text variant="heading4xl" as="h3" color="critical" alignment="center">This is demo by robin</Text>
    //       <Card sectioned>
    //         <Stack
    //           wrap={false}
    //           spacing="extraTight"
    //           distribution="trailing"
    //           alignment="center"
    //         >
    //           <Stack.Item fill>
    //             <TextContainer spacing="loose">
    //               <Text as="h2" variant="headingMd">
    //                 {t("HomePage.heading")}
    //               </Text>
    //               <p>
    //                 <Trans
    //                   i18nKey="HomePage.yourAppIsReadyToExplore"
    //                   components={{
    //                     PolarisLink: (
    //                       <Link url="https://polaris.shopify.com/" external />
    //                     ),
    //                     AdminApiLink: (
    //                       <Link
    //                         url="https://shopify.dev/api/admin-graphql"
    //                         external
    //                       />
    //                     ),
    //                     AppBridgeLink: (
    //                       <Link
    //                         url="https://shopify.dev/apps/tools/app-bridge"
    //                         external
    //                       />
    //                     ),
    //                   }}
    //                 />
    //               </p>
    //               <p>{t("HomePage.startPopulatingYourApp")}</p>
    //               <p>
    //                 <Trans
    //                   i18nKey="HomePage.learnMore"
    //                   components={{
    //                     ShopifyTutorialLink: (
    //                       <Link
    //                         url="https://shopify.dev/apps/getting-started/add-functionality"
    //                         external
    //                       />
    //                     ),
    //                   }}
    //                 />
    //               </p>
    //             </TextContainer>
    //           </Stack.Item>
    //           <Stack.Item>
    //             <div style={{ padding: "0 20px" }}>
    //               <Image
    //                 source={trophyImage}
    //                 alt={t("HomePage.trophyAltText")}
    //                 width={120}
    //               />
    //             </div>
    //           </Stack.Item>
    //         </Stack>
    //       </Card>
    //     </Layout.Section>
    //     <Layout.Section>
    //       <ProductsCard />
    //     </Layout.Section>
    //   </Layout>
    // </Page>
  );
}
