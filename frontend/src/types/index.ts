export interface Application {
  id: string;
  data: {
    headline: string;
    employer: {
      name: string;
    };
    workplace_address: {
      city: string;
    };
    application_deadline: string;
  };
}

export interface ApplicationDetails {
  id: number;
  external_id: string | null;
  headline: string;
  employer: string | null;

  location: {
    municipality: string | null;
    municipality_code: string | null;
    municipality_concept_id: string | null;
    region: string | null;
    region_code: string | null;
    region_concept_id: string | null;
    country: string | null;
    country_code: string | null;
    country_concept_id: string | null;
    street_address: string | null;
    postcode: string | null;
    city: string | null;
    coordinates: [number, number] | null;
  };

  application_deadline: string | null;

  description: string | null;
  source: string | null;

  data: {
    relevance: number | undefined;
    id: string | null;
    external_id: string | null;
    original_id: string | null;
    label: string[];

    webpage_url: string | null;
    logo_url: string | null;

    headline: string;
    application_deadline: string | null;

    number_of_vacancies: number | null;

    description: {
      text: string | null;
      text_formatted: string | null;
      company_information?: string | null;
      needs?: string | null;
      requirements?: string | null;
      conditions?: string | null;
    } | null;

    employment_type: {
      concept_id: string | null;
      label: string | null;
      legacy_ams_taxonomy_id: string | null;
    } | null;

    salary_type: {
      concept_id: string | null;
      label: string | null;
      legacy_ams_taxonomy_id: string | null;
    } | null;

    salary_description: string | null;

    duration: {
      concept_id: string | null;
      label: string | null;
      legacy_ams_taxonomy_id: string | null;
    } | null;

    working_hours_type: {
      concept_id: string | null;
      label: string | null;
      legacy_ams_taxonomy_id: string | null;
    } | null;

    scope_of_work: {
      min: number;
      max: number;
    } | undefined;

    access: string | null;

    employer: {
      phone_number: string | null;
      email: string | null;
      url: string | null;
      organization_number: string | null;
      name: string | null;
      workplace: string | null;
    } | null;

    application_details: {
      information: string | null;
      reference: string | null;
      email: string | null;
      via_af: boolean;
      url: string | null;
      other: string | null;
    } | null;

    experience_required: boolean | null;
    access_to_own_car: boolean | null;
    driving_license_required: boolean | null;
    driving_license: {
      concept_id: string | null;
      label: string | null;
    } | null;

    occupation: {
      concept_id: string | null;
      label: string | null;
      legacy_ams_taxonomy_id: string | null;
    } | null;

    occupation_group: {
      concept_id: string | null;
      label: string | null;
      legacy_ams_taxonomy_id: string | null;
    } | null;

    occupation_field: {
      concept_id: string | null;
      label: string | null;
      legacy_ams_taxonomy_id: string | null;
    } | null;

    workplace_address: {
      municipality: string | null;
      municipality_code: string | null;
      municipality_concept_id: string | null;
      region: string | null;
      region_code: string | null;
      region_concept_id: string | null;
      country: string | null;
      country_code: string | null;
      country_concept_id: string | null;
      street_address: string | null;
      postcode: string | null;
      city: string | null;
      coordinates: [number, number] | null;
    } | null;

    must_have: {
      skills: any[];
      languages: any[];
      work_experiences: {
        weight: number;
        concept_id: string | null;
        label: string | null;
        legacy_ams_taxonomy_id: string | null;
      }[];
      education: any[];
      education_level: any[];
    };

    nice_to_have: {
      skills: any[];
      languages: any[];
      work_experiences: any[];
      education: any[];
      education_level: any[];
    };

    application_contacts: {
      name: string | null;
      description: string | null;
      email: string | null;
      telephone: string | null;
      contact_type: string | null;
    }[];

    publication_date: string | null;
    last_publication_date: string | null;

    removed: boolean;
    removed_date: string | null;

    source_type: string | null;

    timestamp: number | null;
  };
}
