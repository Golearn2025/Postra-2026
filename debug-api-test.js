// Debug script to test organization-specific form data API
// Run this in browser console on http://localhost:3002

const testOrgData = async () => {
  // Organization IDs from database
  const orgs = {
    'Vantage Lane': '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b',
    'Vixev': '9455c595-449e-43f3-9990-b98c51418534', 
    'Katlion': 'faf92ebe-b6e8-41f6-a34a-b605a807d734'
  };

  for (const [orgName, orgId] of Object.entries(orgs)) {
    try {
      console.log(`\n=== Testing ${orgName} (${orgId}) ===`);
      
      const response = await fetch(`/api/campaigns/form-data?organizationId=${orgId}`);
      const data = await response.json();
      
      console.log('Response:', data);
      
      if (data.formData) {
        console.log('Objective Examples:', data.formData.objectiveExamples);
        console.log('Target Audience Examples:', data.formData.targetAudienceExamples);
        console.log('Target Market Examples:', data.formData.targetMarketExamples);
        console.log('Default Timezone:', data.formData.defaultTimezone);
      }
    } catch (error) {
      console.error(`Error for ${orgName}:`, error);
    }
  }
};

// Expected results based on database:
console.log('EXPECTED RESULTS:');
console.log('Vantage Lane - Europe/London, chauffeur examples');
console.log('Vixev - Europe/Bucharest, ecommerce examples'); 
console.log('Katlion - Europe/Bucharest, premium product examples');

testOrgData();
