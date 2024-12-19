import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { FaBook, FaUserShield, FaCommentDots, FaLock, FaBan, FaRegEdit } from 'react-icons/fa';

const rules = [
  {
    title: 'Account Usage',
    icon: FaUserShield,
    content: [
      'Users must be at least 13 years old to create an account.',
      'Users are responsible for all activity under their account.',
      'Profile information must be accurate and not misleading.',
    ],
  },
  {
    title: 'Posting Reviews',
    icon: FaRegEdit,
    content: [
      'Reviews must be respectful, relevant, and free from offensive language.',
      'Fake reviews, promotional reviews, or spam are not allowed.',
      'Reviews should provide constructive feedback, ideally between 50–500 words.',
    ],
  },
  {
    title: 'Interactions with Other Users',
    icon: FaCommentDots,
    content: [
      'Comments must be constructive and respect differing opinions.',
      'Harassment, trolling, or spamming in comment sections is not allowed.',
      'Users can report inappropriate reviews or comments using the "Report Abuse" feature.',
    ],
  },
  {
    title: 'Intellectual Property',
    icon: FaBook,
    content: [
      'Users must not share unauthorized links or distribute copyrighted content.',
      'Quotes from podcasts must be properly attributed.',
      'By posting a review, users grant the application the right to display and use the content.',
    ],
  },
  {
    title: 'Privacy and Data Usage',
    icon: FaLock,
    content: [
      'Users must not include personal information in reviews or comments.',
      'The application will protect user data as outlined in the Privacy Policy.',
      'User activity may be anonymized and analyzed to improve the platform.',
    ],
  },
  {
    title: 'Prohibited Activities',
    icon: FaBan,
    content: [
      'Using bots, scripts, or automated tools to manipulate ratings is prohibited.',
      'Attempting to exploit, hack, or disrupt the platform’s services is forbidden.',
      'Podcast creators or affiliates must disclose their association when posting reviews.',
    ],
  },
];

const RulesetComponent = () => {
  return (
    <Box maxW="5xl" mx="auto" mt={10} p={6} bg="gray.50" shadow="lg" borderRadius="md">
      <Heading as="h1" size="xl" textAlign="center" mb={6} color="blue.500">
        Platform Rules & Guidelines
      </Heading>
      <VStack spacing={8} align="stretch">
        {rules.map((rule, index) => (
          <Box
            key={index}
            p={6}
            bg="white"
            shadow="md"
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <HStack mb={4} spacing={4} align="center">
              <Icon as={rule.icon} w={8} h={8} color="blue.400" />
              <Heading as="h2" size="md" color="gray.700">
                {rule.title}
              </Heading>
            </HStack>
            <Divider mb={4} />
            <Accordion allowToggle>
              {rule.content.map((item, itemIndex) => (
                <AccordionItem key={itemIndex}>
                  <AccordionButton _expanded={{ bg: 'blue.50', color: 'blue.600' }}>
                    <Box flex="1" textAlign="left">
                      Rule {itemIndex + 1}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>{item}</AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default RulesetComponent;
