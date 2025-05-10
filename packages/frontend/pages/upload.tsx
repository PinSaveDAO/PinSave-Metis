import type { NextPage } from "next";

import { PageSEO } from "@/components/SEO";
import UploadForm from "@/components/UploadForm";

const Upload: NextPage = () => {
  return (
    <div>
      <PageSEO
        title={`PinSave Upload Post Page`}
        description={`PinSave upload your decentralized Post Page`}
      />
      <UploadForm />
    </div>
  );
};

export default Upload;
